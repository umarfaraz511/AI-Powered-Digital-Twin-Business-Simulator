import React, { useState } from 'react'
import { useTwinStore } from '../store/index.js'
import { fmt, colorByHealth, colorByRisk } from '../utils/dataUtils.js'
import { Button, Card, Badge, SectionHeader, KPICard, ProgressBar, Modal, FormField } from '../components/ui/index.jsx'

export default function TwinsPage() {
  const { twins, activeTwinId, setActiveTwin } = useTwinStore()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [viewTwin, setViewTwin] = useState(null)

  const filtered = twins.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.industry.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="fade-in">
      <SectionHeader
        title="Digital Twin Registry"
        subtitle={`${twins.length} business replicas · Real-time synchronized`}
        actions={<Button variant="primary" icon="+" onClick={() => setAddOpen(true)}>New Digital Twin</Button>}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard label="Active Twins"     value={twins.filter(t=>t.status==='active').length}   icon="◈" color="var(--emerald)" />
        <KPICard label="Total Simulations" value={twins.reduce((a,t)=>a+t.simulations,0)}       icon="▷" color="var(--navy)" />
        <KPICard label="Total Data Points" value={fmt.num(twins.reduce((a,t)=>a+t.dataPoints,0))} icon="◉" color="var(--teal)" />
        <KPICard label="Avg Health Score"  value={`${Math.round(twins.reduce((a,t)=>a+t.health,0)/twins.length)}%`} icon="⬡" color="var(--violet)" />
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search twins…" style={{ maxWidth: 280 }} />
        {['all','active','warning'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 99, border: `1.5px solid ${filter===f?'var(--navy)':'var(--border)'}`, background: filter===f?'var(--navy)':'transparent', color: filter===f?'#fff':'var(--gray-500)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-sans)', transition: 'all var(--t-fast)' }}>{f}</button>
        ))}
        <span style={{ fontSize: 12, color: 'var(--gray-400)', marginLeft: 'auto' }}>{filtered.length} results</span>
      </div>

      {/* Twin cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {filtered.map(twin => (
          <Card key={twin.id} hover style={{ borderLeft: `4px solid ${twin.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: twin.color + '18', border: `1.5px solid ${twin.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{twin.icon}</div>
                <div>
                  <h4 style={{ marginBottom: 2 }}>{twin.name}</h4>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{twin.industry} · {fmt.num(twin.dataPoints)} points</div>
                </div>
              </div>
              <Badge label={twin.status === 'active' ? 'Live' : 'Warning'} variant={twin.status === 'active' ? 'active' : 'warning'} size="md" />
            </div>

            <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 16, lineHeight: 1.5 }}>{twin.description}</p>

            {/* Health bar */}
            <div style={{ marginBottom: 14 }}>
              <ProgressBar value={twin.health} label="System Health" color={colorByHealth(twin.health)} height={7} />
            </div>

            {/* KPI mini grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, background: 'var(--off-white)', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1.5px solid var(--border)', marginBottom: 16 }}>
              {[
                { l: 'Accuracy',   v: `${twin.accuracy}%`,   c: 'var(--navy)'    },
                { l: 'Efficiency', v: `${twin.kpis.efficiency}%`, c: 'var(--teal)' },
                { l: 'Risk',       v: twin.kpis.riskScore,   c: colorByRisk(twin.kpis.riskScore) },
                { l: 'Sims',       v: twin.simulations,      c: 'var(--gray-700)' },
              ].map((k, i) => (
                <div key={k.l} style={{ padding: '10px 12px', textAlign: 'center', borderRight: i < 3 ? '1.5px solid var(--border)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: k.c, marginBottom: 2 }}>{k.v}</div>
                  <div style={{ fontSize: 9, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>{k.l}</div>
                </div>
              ))}
            </div>

            {/* Revenue */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(15,76,129,.04)', borderRadius: 'var(--r-md)', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2 }}>Simulated Revenue</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gray-800)' }}>{fmt.currency(twin.revenue)}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: twin.revenueGrowth >= 0 ? 'var(--emerald)' : 'var(--rose)', background: twin.revenueGrowth >= 0 ? 'var(--emerald-light)' : 'var(--rose-light)', padding: '4px 10px', borderRadius: 99 }}>
                {twin.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(twin.revenueGrowth)}%
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="primary" size="sm" onClick={() => { setActiveTwin(twin.id); setViewTwin(twin) }} style={{ flex: 1, justifyContent: 'center' }}>Open Twin</Button>
              <Button variant="secondary" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Simulate</Button>
              <Button variant="secondary" size="sm">⋯</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Twin Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register New Digital Twin" width={520}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Twin Name"><input placeholder="e.g. RetailChain APAC" /></FormField>
          <FormField label="Industry">
            <select>
              {['Manufacturing','Retail','Finance','Healthcare','Logistics','Energy','SaaS','Government'].map(i => <option key={i}>{i}</option>)}
            </select>
          </FormField>
          <FormField label="Data Source"><input placeholder="API endpoint or upload" /></FormField>
          <FormField label="Update Frequency">
            <select><option>Real-time</option><option>Hourly</option><option>Daily</option></select>
          </FormField>
          <FormField label="Description" hint="Describe what this twin models">
            <textarea rows={3} placeholder="Brief description of the business process being replicated…" style={{ resize: 'vertical' }} />
          </FormField>
          <FormField label="Initial Revenue ($M)"><input type="number" placeholder="e.g. 12.5" /></FormField>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <Button variant="primary" onClick={() => setAddOpen(false)}>Create Twin</Button>
          <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* View Twin Modal */}
      {viewTwin && (
        <Modal open={!!viewTwin} onClose={() => setViewTwin(null)} title={viewTwin.name} width={540}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              ['Created', viewTwin.createdAt], ['Industry', viewTwin.industry],
              ['Data Points', fmt.num(viewTwin.dataPoints)], ['Last Sync', viewTwin.lastSync],
              ['Health', `${viewTwin.health}%`], ['Accuracy', `${viewTwin.accuracy}%`],
              ['Employees', viewTwin.employees?.toLocaleString()], ['Simulations', viewTwin.simulations],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '10px 14px', background: 'var(--off-white)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>{v}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.7 }}>{viewTwin.description}</p>
        </Modal>
      )}
    </div>
  )
}
