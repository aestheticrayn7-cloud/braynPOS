'use client'
import { ApprovalsList } from '@/components/users/ApprovalsList'

export default function ApprovalsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Pending Approvals</h1>
        <p className="text-muted">Review and authorize sensitive actions requested by your team.</p>
      </div>

      <ApprovalsList />
    </div>
  )
}
