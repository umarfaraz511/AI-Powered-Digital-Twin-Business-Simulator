import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore, useNotifStore } from '../../store/index.js'
import { Badge, Button } from '../ui/index.jsx'

const NAV = [
  { path: '/',            icon: '⬡', label: 'Command Center'  },
  { path: '/twins',       icon: '◈', label: 'Digital Twins'   },
  { path: '/simulate',    icon: '▷', label: 'Simulate'        },
  { path: '/forecast',    icon: '〜', label: 'Forecasting'     },
  { path: '/anomalies',   icon: '⚠', label: 'Anomalies'       },
  { path: '/models',      icon: '◉', label: 'AI Models'       },
  { path: '/reports',     icon: '⊟', label: 'Reports'         },
  { path: '/assistant',   icon: '✦', label: 'FAIZ Assistant'  },
]

const SIDEBAR_W = 220

export default function Layout({ children }) {
  const { user } = useAuthStore()
  const { notifications, markAllRead } = useNotifStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const unread = notifications.filter(n => !n.read).length
  const loc = useLocation()

  const sideW = collapsed ? 64 : SIDEBAR_W

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sideW, flexShrink: 0, background: 'var(--gray-900)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh',
        zIndex: 200, transition: 'width var(--t-base) var(--ease)',
        overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '18px 14px' : '18px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 12, minHeight: 72 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: '#fff',
            boxShadow: '0 2px 8px rgba(26,155,138,.4)',
          }}>DT</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: '#fff', lineHeight: 1.2 }}>Digital Twin</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Business Simulator</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {!collapsed && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', letterSpacing: '0.1em', fontWeight: 700, padding: '8px 10px 4px', textTransform: 'uppercase' }}>Navigation</div>}
          {NAV.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '10px 14px' : '9px 12px',
                  borderRadius: 'var(--r-md)', marginBottom: 2,
                  background: isActive ? 'linear-gradient(90deg, rgba(26,155,138,.25) 0%, rgba(15,76,129,.15) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(26,155,138,.3)' : '1px solid transparent',
                  transition: 'all var(--t-fast) var(--ease)',
                  cursor: 'pointer',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                  <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0, color: isActive ? 'var(--teal-light)' : 'rgba(255,255,255,.45)', filter: isActive ? 'none' : 'grayscale(1)' }}>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,.55)', transition: 'color var(--t-fast)' }}>{item.label}</span>}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{user?.avatar}</div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{user?.role}</div>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(c => !c)} style={{ width: '100%', marginTop: 6, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '7px', color: 'rgba(255,255,255,.45)', cursor: 'pointer', fontSize: 12, transition: 'all var(--t-fast)' }}>
            {collapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, marginLeft: sideW, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'margin-left var(--t-base) var(--ease)' }}>

        {/* Top bar */}
        <header style={{
          height: 64, background: 'var(--surface)', borderBottom: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', position: 'sticky', top: 0, zIndex: 100,
          boxShadow: 'var(--shadow-xs)',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500 }}>FARSIM</span>
            <span style={{ color: 'var(--gray-300)' }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
              {NAV.find(n => n.path === loc.pathname)?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Status dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--emerald-light)', padding: '4px 10px', borderRadius: 99 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--emerald)' }}>4 Twins Active</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(o => !o)} style={{ width: 38, height: 38, borderRadius: 10, background: notifOpen ? 'var(--navy)' : 'var(--gray-50)', border: '1.5px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all var(--t-fast)', color: notifOpen ? '#fff' : 'var(--gray-600)' }}>🔔</button>
              {unread > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--rose)', color: '#fff', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}>{unread}</span>}

              {notifOpen && (
                <div className="fade-up" style={{ position: 'absolute', top: 46, right: 0, width: 340, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)', zIndex: 200 }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5>Notifications</h5>
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--navy)', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', opacity: n.read ? 0.55 : 1, background: n.read ? 'transparent' : 'var(--off-white)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{n.title}</span>
                        <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.5, margin: 0 }}>{n.msg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{ background: 'var(--surface)', borderTop: '1.5px solid var(--border)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--navy), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>DT</div>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>FARSIM™ · Built by Umar Faraz · Enterprise v2.1.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Developed by <strong style={{ color: 'var(--gray-600)' }}>Umar Faraz</strong></span>
            <a href="https://github.com/umarfaraz511" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--navy)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⊹ GitHub</a>
            <a href="https://www.linkedin.com/in/umar-faraz-700457280" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--teal)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>⊹ LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
