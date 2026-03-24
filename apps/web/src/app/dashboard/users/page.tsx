'use client'
import { useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { PasswordConfirmModal } from '@/components/shared/PasswordConfirmModal'
import { ApprovalsList } from '@/components/users/ApprovalsList'
import { toast } from 'react-hot-toast'

interface User { id: string; username: string; email: string; role: string; status: 'ACTIVE' | 'INACTIVE' | 'PENDING'; mfaEnabled: boolean; channel?: { id: string; name: string } }
interface Channel { id: string; name: string }

const ALL_ROLES = ['MANAGER_ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON']
const JUNIOR_ROLES = ['CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON']

const statusBadge: Record<string, string> = {
  ACTIVE: 'badge-success', INACTIVE: 'badge-danger', PENDING: 'badge-warning'
}

const roleColor: Record<string, string> = {
  SUPER_ADMIN: 'badge-danger', MANAGER_ADMIN: 'badge-warning', MANAGER: 'badge-primary',
  CASHIER: 'badge-success', STOREKEEPER: 'badge-info', PROMOTER: 'badge-info', SALES_PERSON: 'badge-primary'
}

export default function UsersPage() {
  const token = useAuthStore((s) => s.accessToken)
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<User[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'CASHIER', 
    channelId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING'
  })
  const [search, setSearch] = useState('')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'approvals'>('users')

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'
  const isManagerAdmin = currentUser?.role === 'MANAGER_ADMIN'
  const isManager = currentUser?.role === 'MANAGER'
  
  const canSeeApprovals = isSuperAdmin || isManagerAdmin || isManager
  const availableRoles = isManager ? JUNIOR_ROLES : ALL_ROLES

  const fetchAll = async () => {
    if (!token) return
    try {
      const [uRes, cRes] = await Promise.all([
        api.get<{ data: User[] }>(`/users?limit=50${search ? `&search=${search}` : ''}`, token),
        api.get<Channel[]>('/channels', token),
      ])
      setUsers(uRes.data ?? [])
      
      const channelList = Array.isArray(cRes) ? cRes : [cRes as unknown as Channel]
      if (isManager && currentUser?.channelId) {
        setChannels(channelList.filter(c => c.id === currentUser.channelId))
        setForm(f => ({ ...f, channelId: currentUser.channelId! }))
      } else {
        setChannels(channelList)
      }
    } catch (err) { 
      console.error('[Users Fetch Error]:', err)
      if ((err as any).status === 403) {
        toast.error('Access Restricted: Admin permissions required.', { id: 'security-block', icon: '🛡️' })
      } else {
        toast.error('Failed to load users.')
      }
    }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [token, search])

  const openAddModal = () => {
    setEditingUser(null)
    setForm({ 
      username: '', 
      email: '', 
      password: '', 
      role: 'CASHIER', 
      channelId: isManager ? (currentUser?.channelId || '') : '',
      status: 'ACTIVE'
    })
    setShowModal(true)
  }

  const openEditModal = (u: User) => {
    setEditingUser(u)
    setForm({ 
      username: u.username, 
      email: u.email, 
      password: '', 
      role: u.role, 
      channelId: u.channel?.id || '',
      status: u.status
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.email) { toast.error('Username and email are required'); return }
    if (!editingUser && !form.password) { toast.error('Password is required for new users'); return }
    
    setSaving(true)
    try {
      if (editingUser) {
        const payload: any = { 
          username: form.username, 
          email: form.email, 
          role: form.role, 
          channelId: form.channelId || null,
          status: form.status
        }
        const res = await api.patch<any>(`/users/${editingUser.id}`, payload, token!)
        if (res.message) {
          toast.success(res.message.replace('Super Admin', 'Administrator Manager') + (res.approvalId ? `\nRequest ID: ${res.approvalId}` : ''))
        }
      } else {
        const payload = { 
          username: form.username, 
          email: form.email, 
          password: form.password, 
          role: form.role, 
          channelId: form.channelId || null 
        }
        const res = await api.post<any>('/users', payload, token!)
        if (res.message) {
          toast.success(res.message.replace('Super Admin', 'Administrator Manager') + (res.approvalId ? `\nRequest ID: ${res.approvalId}` : ''))
        }
      }
      
      setShowModal(false)
      fetchAll()
    } catch (err: any) { 
      if (err.status === 403) {
        toast.error('Insufficient permissions.', { icon: '🛡️' })
      } else if (err.approvalId) {
        toast.error(`${err.message}\nRequest ID: ${err.approvalId}`)
        setShowModal(false)
      } else {
        toast.error('Failed: ' + (err.message || 'Unknown error')) 
      }
    }
    finally { setSaving(false) }
  }

  const handleToggle = async (u: User) => {
    try {
      const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await api.patch(`/users/${u.id}`, { status: nextStatus }, token!)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: nextStatus } : x))
      toast.success(`User ${nextStatus.toLowerCase()}!`)
    } catch (err: any) { 
      if (err.status === 403) {
        toast.error('Permission Denied.', { icon: '🛡️' })
      } else {
        toast.error('Failed: ' + err.message) 
      }
    }
  }

  const handleDelete = async (password: string) => {
    if (!userToDelete) return
    try {
      await api.delete(`/users/${userToDelete.id}`, token!, { password })
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      toast.success('User deleted')
      setUserToDelete(null)
    } catch (err: any) {
      if (err.status === 403) {
        toast.error('Invalid password or insufficient permissions.', { icon: '🛡️' })
      } else if (err.approvalId) {
        toast.error(`${err.message}\nRequest ID: ${err.approvalId}`)
        setUserToDelete(null)
      } else {
        toast.error('Failed: ' + err.message)
      }
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Users</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {canSeeApprovals && (
            <div className="tabs" style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 8, padding: 4 }}>
              <button 
                className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('users')}
              >
                All Users
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'approvals' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('approvals')}
              >
                Pending Approvals
              </button>
            </div>
          )}
          <button className="btn btn-primary" onClick={openAddModal}>+ Add User</button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <>
          <input className="input" placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 20, maxWidth: 360 }} />

          <div className="card">
            {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
              <table className="table">
                <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Channel</th><th>MFA</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No users found.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${roleColor[u.role] || 'badge-info'}`}>{u.role}</span></td>
                      <td>{u.channel?.name || 'All Channels'}</td>
                      <td>{u.mfaEnabled ? <span className="badge badge-success">On</span> : <span className="badge badge-warning">Off</span>}</td>
                      <td><span className={`badge ${statusBadge[u.status] || 'badge-info'}`}>{u.status}</span></td>
                      <td style={{ textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(u)} title="Edit User">🔧</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u)} title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>{u.status === 'ACTIVE' ? '🔴' : '🟢'}</button>
                        <button className="btn btn-ghost btn-sm text-danger" onClick={() => setUserToDelete(u)} title="Delete User">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <ApprovalsList />
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 460 }}>
            <h3>{editingUser ? '🔧 Edit User' : '👤 Add New User'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Username *</label>
                  <input className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required placeholder="e.g. john_doe" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Role</label>
                  <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="user@company.com" />
              </div>
              
              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Min 8 characters" minLength={8} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Assign Channel</label>
                  <select className="input" value={form.channelId} onChange={e => setForm({ ...form, channelId: e.target.value })} disabled={isManager}>
                    {!isManager && <option value="">All Channels</option>}
                    {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Status</label>
                  <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userToDelete && (
        <PasswordConfirmModal
          title="🗑️ Delete User"
          message={`Are you sure you want to delete ${userToDelete.username}? This action is irreversible.`}
          onConfirm={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  )
}
