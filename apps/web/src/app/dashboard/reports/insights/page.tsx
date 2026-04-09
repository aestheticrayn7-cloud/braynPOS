'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface AgingBucket {
  label:     string
  amount:    number
  customers: string[]
}

interface DowTrend {
  day:     string
  revenue: number
  count:   number
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function FinancialInsightsPage() {
  const token = useAuthStore(s => s.accessToken)
  const [agingData, setAgingData] = useState<{ buckets: AgingBucket[], totalOutstanding: number } | null>(null)
  const [dowTrends, setDowTrends] = useState<DowTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    const fetchData = async () => {
      try {
        const [aging, dow] = await Promise.all([
          api.get<any>('/reports/aging-analysis', token),
          api.get<any>('/reports/dow-trends', token)
        ])
        setAgingData(aging)
        setDowTrends(dow)
      } catch (err) {
        console.error('Failed to fetch insights:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n)

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Analyzing financial trends...</div>

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>
      <div className="page-header">
        <div>
          <h1>Financial Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Accounts Receivable aging and operational trends</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginTop: 24 }}>
        
        {/* Aging Analysis (Debtors) */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>📊 Debtors Aging (A/R)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agingData?.buckets || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                  label={(props: any) => `${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                >
                  {(agingData?.buckets || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>Total Outstanding:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)' }}>
                {formatCurrency(agingData?.totalOutstanding || 0)}
              </span>
            </div>
            {agingData?.buckets.map((b, i) => (
               <div key={i} style={{ fontSize: '0.85rem', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{b.label}:</span>
                  <strong>{formatCurrency(b.amount)}</strong>
               </div>
            ))}
          </div>
        </div>

        {/* Day of Week Trends */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>📅 Busiest Days (Last 30 Days)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dowTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} 
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }}
                  formatter={(value: any) => formatCurrency(Number(value || 0))}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Average revenue distribution by day of the week.
          </p>
        </div>

      </div>

      <div className="card" style={{ marginTop: 24, padding: 24 }}>
        <h3>📜 At-Risk Debtors List</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          Customers with outstanding balances in P2 (31-60 days) and P3 (61+ days) buckets.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Aging Bucket</th>
              <th>Sample Customers at Risk</th>
              <th style={{ textAlign: 'right' }}>Total Bucket Amount</th>
            </tr>
          </thead>
          <tbody>
            {(agingData?.buckets || []).filter(b => b.amount > 0).map((b, i) => (
              <tr key={i}>
                <td><span className={`badge ${i === 0 ? 'badge-warning' : 'badge-danger'}`}>{b.label}</span></td>
                <td>{b.customers.join(', ') || 'Anonymous Debtor'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(b.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
