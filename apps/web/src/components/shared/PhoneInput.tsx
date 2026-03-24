'use client'
import React from 'react'

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string
  value: string
  onChange: (value: string) => void
}

/**
 * PhoneInput component that enforces Kenyan phone number format (07********).
 * Shows the constraint in red until correctly formatted.
 * Only allows digits and a maximum of 10 characters.
 */
export function PhoneInput({ label, value, onChange, className, ...props }: PhoneInputProps) {
  const isValid = /^07\d{8}$/.test(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '') // Only allow digits
    if (val.length > 10) val = val.slice(0, 10) // Should not allow exceeding 10 digits
    onChange(val)
  }

  return (
    <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
      <input
        {...props}
        className={`${className || 'input'} ${!isValid && value.length > 0 ? 'input-error' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder="07********"
        maxLength={10}
        type="tel"
      />
      <div style={{ 
        fontSize: '0.8rem', 
        color: isValid ? 'var(--success)' : 'var(--danger)', 
        fontWeight: 700,
        letterSpacing: '1.5px',
        marginTop: 2,
        transition: 'color 0.2s ease'
      }}>
        {isValid ? '✅ VALID FORMAT' : '07********'}
      </div>
    </div>
  )
}
