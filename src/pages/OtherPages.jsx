import React, { useState } from 'react'
import { useTwinStore } from '../store/index.js'
import { anomalyFeed } from '../utils/dataUtils.js'
import { explainAnomaly } from '../services/groqService.js'
import { Card, Badge, Button, SectionHeader, KPICard, Spinner, Modal } from '../components/ui/index.jsx'

export function AnomaliesPage() {
  const { twins } = useTwinStore()
  const [anomalies] = useState(() => anomalyFeed(12))
  const [selected, setSelected]       = useState(null)
  const [explanation, setExplanation] = useState('')
  const [explaining, setExplaining]   = useState(false)
  const [filterSev, setFilterSev]     = useState('all')
  const [search, setSearch]           = useState('')

  const twin = twins[0]

  const explain = async (a) => {
    setSelected(a)
    setExplaining(true)
    setExplanation('')
    try {
      const res = await explainAnomaly(twin, a.description)
      setExplanation(res)
    } catch (e) {
      setExplanation('Unable to fetch explanation: ' + e.message)
    }
    setExplaining(false)
  }

  const filtered = anomalies.filter(a => {
    const matchSev    = filterSev === 'all' || a.severity === filterSev
    const matchSearch = a.description.toLowerCase().includes(search.toLowerCase())
    return matchSev && matchSearch
  })

  const sevColors = { critical: 'var(--rose)', high: 'var(--amber)', medium: 'var(--navy)', low: 'var(--gray-400)' }
  const sevVariants = { critical: 'danger', high: 'warning', medium: 'navy', low: 'default' }

  return (
    <div className="fade-in">
      <SectionHeader title="Anomaly Detection Center" subtitle="AI-powered real-time anomaly monitoring across all digital twins" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="Total Anomalies"    value={anomalies.length}                                        icon="⚠"  color="var(--rose)"    />
        <KPICard label="Critical"           value={anomalies.filter(a=>a.severity==='critical').length}     icon="🚨" color="var(--rose)"    />
        <KPICard label="Unacknowledged"     value={anomalies.filter(a=>!a.acknowledged).length}             icon="🔔" color="var(--amber)"   />
        <KPICard label="Avg Deviation"      value="2.1σ"                                                    icon="📉" color="var(--violet)"  />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search anomalies…" style={{ maxWidth: 260 }} />
        {['all','critical','high','medium','low'].map(s => (
          <button key={s} onClick={() => setFilterSev(s)} style={{ padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${filterSev===s?(sevColors[s]||'var(--navy)'):'var(--border)'}`, background: filterSev===s ? (sevColors[s]||'var(--navy)')+'18' : 'transparent', color: filterSev===s ? (sevColors[s]||'var(--navy)') : 'var(--gray-500)', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-sans)', transition: 'all var(--t-fast)' }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        <Card pad="0" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h5>Live Anomaly Feed</h5>
            <Badge label={`${filtered.length} anomalies`} variant="navy" />
          </div>
          {filtered.map(a => (
            <div key={a.id} style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, opacity: a.acknowledged ? 0.55 : 1, cursor: 'pointer', background: selected?.id === a.id ? 'rgba(15,76,129,.04)' : 'transparent' }}
              onClick={() => explain(a)}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: sevColors[a.severity], marginTop: 5, flexShrink: 0, animation: !a.acknowledged && a.severity === 'critical' ? 'pulse 1.5s infinite' : 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge label={a.severity.toUpperCase()} variant={sevVariants[a.severity]} />
                    <Badge label={a.value} variant="default" />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{a.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.5 }}>{a.description}</p>
                {a.acknowledged && <span style={{ fontSize: 10, color: 'var(--gray-300)' }}>Acknowledged</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); explain(a) }} style={{ flexShrink: 0 }}>✦ Explain</Button>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {selected && (
            <Card>
              <h5 style={{ marginBottom: 10 }}>FAIZ Explanation</h5>
              <div style={{ padding: '10px 14px', background: 'var(--off-white)', borderRadius: 10, marginBottom: 10, fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.5 }}>
                <Badge label={selected.severity.toUpperCase()} variant={sevVariants[selected.severity]} size="md" />
                <p style={{ margin: '8px 0 0', fontSize: 12 }}>{selected.description}</p>
              </div>
              {explaining ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Spinner size={18} />
                  <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>FAIZ is analyzing…</span>
                </div>
              ) : explanation && (
                <div style={{ fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.7, borderLeft: '3px solid var(--teal)', paddingLeft: 12 }}>
                  {explanation}
                </div>
              )}
              {!explaining && explanation && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button variant="primary" size="sm">Acknowledge</Button>
                  <Button variant="secondary" size="sm">Create Ticket</Button>
                </div>
              )}
            </Card>
          )}

          <Card>
            <h5 style={{ marginBottom: 12 }}>Severity Breakdown</h5>
            {['critical','high','medium','low'].map(sev => {
              const count = anomalies.filter(a => a.severity === sev).length
              const pct   = Math.round(count / anomalies.length * 100)
              return (
                <div key={sev} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, textTransform: 'capitalize', color: sevColors[sev], fontWeight: 600 }}>{sev}</span>
                    <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: 'var(--gray-100)' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: sevColors[sev] }} />
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── Reports Page ──────────────────────────────────────────────
export function ReportsPage() {
  const REPORTS = [
    { name: 'Q2 2025 Executive Summary', type: 'Executive', date: '2025-06-01', pages: 24, status: 'ready' },
    { name: 'Supply Chain Risk Assessment', type: 'Risk', date: '2025-05-28', pages: 18, status: 'ready' },
    { name: 'Revenue Forecast Report — FY2025', type: 'Forecast', date: '2025-05-25', pages: 32, status: 'ready' },
    { name: 'Model Performance Audit', type: 'Technical', date: '2025-05-20', pages: 14, status: 'ready' },
    { name: 'Anomaly Detection Summary', type: 'Operations', date: '2025-05-15', pages: 9, status: 'ready' },
    { name: 'APAC Expansion Simulation', type: 'Simulation', date: '2025-05-12', pages: 22, status: 'generating' },
  ]
  const typeColors = { Executive: 'navy', Risk: 'danger', Forecast: 'teal', Technical: 'violet', Operations: 'warning', Simulation: 'running' }

  return (
    <div className="fade-in">
      <SectionHeader title="Reports & Analytics" subtitle="Export insights, simulations, and ML model outputs"
        actions={<Button variant="primary" icon="+">Generate Report</Button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="Total Reports"  value={REPORTS.length}                                  icon="⊟" color="var(--navy)"   />
        <KPICard label="Ready to Export" value={REPORTS.filter(r=>r.status==='ready').length}  icon="✓" color="var(--emerald)" />
        <KPICard label="Generating"     value={REPORTS.filter(r=>r.status==='generating').length} icon="↻" color="var(--amber)" />
        <KPICard label="Total Pages"    value={REPORTS.reduce((a,r)=>a+r.pages,0)}              icon="📄" color="var(--teal)"   />
      </div>

      <Card pad="0" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>Report Library</h5>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" icon="⊟">Bulk Export</Button>
            <Button variant="secondary" size="sm">Filter</Button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--off-white)' }}>
              {['Report Name','Type','Date','Pages','Status','Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1.5px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'var(--off-white)' : 'transparent' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{r.name}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={r.type} variant={typeColors[r.type] || 'default'} /></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-500)' }}>{r.date}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-500)' }}>{r.pages}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={r.status === 'ready' ? 'Ready' : 'Generating'} variant={r.status === 'ready' ? 'active' : 'running'} /></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Button variant="secondary" size="sm" disabled={r.status !== 'ready'}>PDF</Button>
                    <Button variant="secondary" size="sm" disabled={r.status !== 'ready'}>Excel</Button>
                    <Button variant="secondary" size="sm" disabled={r.status !== 'ready'}>CSV</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
