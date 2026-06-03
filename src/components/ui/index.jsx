import React, { useState, useEffect, useRef } from 'react'

// ── Button ────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, loading, icon, className = '', style = {} }) {
  const S = {
    primary:  { bg: 'var(--navy)',      color: '#fff',              border: 'none',                        hover: 'var(--navy-dark)' },
    secondary:{ bg: 'var(--surface)',   color: 'var(--gray-700)',   border: '1.5px solid var(--border)',   hover: 'var(--gray-50)'   },
    teal:     { bg: 'var(--teal)',      color: '#fff',              border: 'none',                        hover: '#158476'          },
    ghost:    { bg: 'transparent',      color: 'var(--navy)',       border: '1.5px solid var(--navy)',     hover: 'rgba(15,76,129,.06)' },
    danger:   { bg: 'var(--rose)',      color: '#fff',              border: 'none',                        hover: '#c44452'          },
    success:  { bg: 'var(--emerald)',   color: '#fff',              border: 'none',                        hover: '#137345'          },
  }[variant] || {}
  const P = { sm: '6px 14px', md: '9px 20px', lg: '12px 28px' }[size]
  const FS = { sm: '0.8rem', md: '0.875rem', lg: '1rem' }[size]
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: P, fontSize: FS, fontWeight: 600, letterSpacing: '0.01em',
        borderRadius: 'var(--r-md)', border: S.border || 'none',
        background: hov ? S.hover : S.bg, color: S.color,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all var(--t-fast) var(--ease)',
        boxShadow: variant === 'primary' ? 'var(--shadow-sm)' : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {loading ? <Spinner size={14} color={S.color} /> : icon && <span style={{ fontSize: '1.05em', lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style = {}, pad = '20px', hover = false }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 'var(--r-xl)', padding: pad,
        boxShadow: hov ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transition: 'box-shadow var(--t-base) var(--ease), transform var(--t-base) var(--ease)',
        transform: hov ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >{children}</div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────
export function KPICard({ label, value, delta, deltaLabel, icon, color = 'var(--navy)', sub, style = {} }) {
  const isPos = parseFloat(delta) >= 0
  return (
    <Card hover style={{ ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 400, color: 'var(--gray-800)', lineHeight: 1, marginBottom: 10 }}>{value}</div>
      {(delta !== undefined || sub) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {delta !== undefined && (
            <span style={{ fontSize: 12, fontWeight: 700, color: isPos ? 'var(--emerald)' : 'var(--rose)', background: isPos ? 'var(--emerald-light)' : 'var(--rose-light)', padding: '2px 7px', borderRadius: 99 }}>
              {isPos ? '↑' : '↓'} {Math.abs(delta)}%
            </span>
          )}
          {deltaLabel && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{deltaLabel}</span>}
          {sub && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{sub}</span>}
        </div>
      )}
    </Card>
  )
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ label, variant = 'default', size = 'sm' }) {
  const S = {
    default:  { bg: 'var(--gray-100)',      color: 'var(--gray-600)' },
    active:   { bg: 'var(--emerald-light)', color: 'var(--emerald)'  },
    warning:  { bg: 'var(--amber-light)',   color: 'var(--amber)'    },
    danger:   { bg: 'var(--rose-light)',    color: 'var(--rose)'     },
    navy:     { bg: 'rgba(15,76,129,.1)',   color: 'var(--navy)'     },
    teal:     { bg: 'var(--teal-dim)',      color: 'var(--teal)'     },
    violet:   { bg: 'var(--violet-light)',  color: 'var(--violet)'   },
    running:  { bg: 'rgba(26,155,138,.12)', color: 'var(--teal)'     },
    queued:   { bg: 'rgba(108,66,212,.1)',  color: 'var(--violet)'   },
  }[variant] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' }
  const pad = size === 'sm' ? '2px 9px' : '4px 12px'
  const fs  = size === 'sm' ? '0.72rem' : '0.8rem'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: pad, fontSize: fs, fontWeight: 600, borderRadius: 99, background: S.bg, color: S.color, whiteSpace: 'nowrap' }}>
      {variant === 'active'  && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />}
      {variant === 'running' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse 1.4s infinite' }} />}
      {label}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 20, color = 'var(--navy)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  )
}

// ── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'var(--navy)', height = 6, label }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12, color: 'var(--gray-500)' }}><span>{label}</span><span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>{value}{typeof max === 'number' && max === 100 ? '%' : `/${max}`}</span></div>}
      <div style={{ height, borderRadius: 99, background: 'var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s var(--ease)' }} />
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 600 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(14,19,40,.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-up"
        style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: width, maxHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1.5px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'var(--gray-100)', border: 'none', width: 30, height: 30, borderRadius: 8, fontSize: 16, cursor: 'pointer', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Tooltip ───────────────────────────────────────────────────
export function Tooltip({ content, children }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--gray-800)', color: '#fff', fontSize: 11, padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 100, pointerEvents: 'none' }}>
          {content}
        </div>
      )}
    </div>
  )
}

// ── SectionHeader ─────────────────────────────────────────────
export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 style={{ marginBottom: 4 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: 'var(--gray-400)' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon, title, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 42, marginBottom: 12 }}>{icon}</div>
      <h4 style={{ marginBottom: 8, color: 'var(--gray-600)' }}>{title}</h4>
      <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 20 }}>{message}</p>
      {action}
    </div>
  )
}

// ── Stat Row ──────────────────────────────────────────────────
export function StatRow({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: '14px 18px', borderRight: i < items.length - 1 ? '1.5px solid var(--border)' : 'none', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gray-800)', marginBottom: 3 }}>{item.value}</div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Input with label ──────────────────────────────────────────
export function FormField({ label, children, hint, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>{label}</label>
      {children}
      {hint  && <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: 'var(--rose)',     marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ── Custom Recharts Tooltip ───────────────────────────────────
export function ChartTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', minWidth: 130 }}>
      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 12, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <span style={{ color: p.color || 'var(--gray-600)' }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{prefix}{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  )
}
