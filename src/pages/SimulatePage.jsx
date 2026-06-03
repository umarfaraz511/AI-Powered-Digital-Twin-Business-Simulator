import React, { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, BarChart, Bar } from 'recharts'
import { useTwinStore, useSimStore } from '../store/index.js'
import { analyzeScenario } from '../services/groqService.js'
import { SIM_STEPS, fmt } from '../utils/dataUtils.js'
import { Button, Card, Badge, SectionHeader, FormField, Spinner, Modal, ChartTooltip, StatRow } from '../components/ui/index.jsx'

const SCENARIO_TYPES = [
  { id: 'demand',     label: 'Demand Shift',       icon: '📈', desc: 'Model changes in market demand and customer behavior' },
  { id: 'risk',       label: 'Risk Stress Test',   icon: '⚠',  desc: 'Simulate supply chain disruptions or operational failures' },
  { id: 'growth',     label: 'Growth Expansion',   icon: '🌍', desc: 'Forecast outcomes of entering new markets or products' },
  { id: 'stress',     label: 'Financial Stress',   icon: '💹', desc: 'Model macroeconomic shocks, rate changes, or market crashes' },
  { id: 'efficiency', label: 'Efficiency Program', icon: '⚙',  desc: 'Optimize operations, staffing, and process automation' },
  { id: 'custom',     label: 'Custom Scenario',    icon: '✦',  desc: 'Define any business scenario with free-form parameters' },
]

export default function SimulatePage() {
  const { twins, activeTwinId } = useTwinStore()
  const { scenarios, addScenario, setRunning, completeScenario } = useSimStore()
  const [form, setForm] = useState({ name: '', type: 'demand', description: '', twinId: activeTwinId, horizon: '90 days', intensity: '35', direction: 'increase' })
  const [phase, setPhase] = useState('builder') // builder | running | result
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const twin = twins.find(t => t.id === form.twinId) || twins[0]

  const completedScenarios = scenarios.filter(s => s.status === 'completed').slice(0, 8)
  const runningScenarios   = scenarios.filter(s => s.status === 'running' || s.status === 'queued')

  const runSimulation = async () => {
    if (!form.name.trim()) { setError('Scenario name is required'); return }
    setError('')
    setPhase('running')
    setProgress(0)

    // Animate through steps
    for (let i = 0; i < SIM_STEPS.length; i++) {
      setCurrentStep(SIM_STEPS[i])
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600))
      setProgress(Math.round(((i + 1) / SIM_STEPS.length) * 100))
    }

    // Call Groq AI
    try {
      const scenarioDesc = `${form.name}: ${form.type} scenario — ${form.description || form.direction + ' by ' + form.intensity + '%'} over ${form.horizon}`
      const analysis = await analyzeScenario(twin, scenarioDesc)

      const newScenario = {
        id: `scn_${Date.now()}`,
        name: form.name,
        twinId: form.twinId,
        status: 'completed',
        type: form.type,
        confidence: analysis.confidence,
        impactRevenue: parseFloat(analysis.revenueImpact) / 100 * twin.revenue,
        impactRisk: parseInt(analysis.riskImpact),
        duration: form.horizon,
        createdAt: new Date().toISOString().split('T')[0],
        results: {
          revenueChange: parseFloat(analysis.revenueImpact),
          costChange: 0,
          riskChange: parseInt(analysis.riskImpact),
          efficiencyChange: parseFloat(analysis.efficiencyImpact),
        },
        analysis,
      }
      addScenario(newScenario)
      setResult({ ...newScenario, analysis })
      setPhase('result')
    } catch (e) {
      setError('AI analysis failed: ' + e.message)
      setPhase('builder')
    }
  }

  const statusBadge = s => ({ completed: 'active', running: 'running', queued: 'queued', warning: 'warning' })[s] || 'default'

  return (
    <div className="fade-in">
      <SectionHeader title="Simulation Studio" subtitle="Build AI-powered predictive scenarios for any digital twin" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22 }}>

        {/* ── LEFT: Builder / Running / Result ── */}
        <div>

          {phase === 'builder' && (
            <Card style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 18 }}>Configure Scenario</h4>

              {/* Type selector */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 10 }}>Scenario Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {SCENARIO_TYPES.map(t => (
                    <div key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
                      style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', border: `2px solid ${form.type === t.id ? 'var(--navy)' : 'var(--border)'}`, background: form.type === t.id ? 'rgba(15,76,129,.06)' : 'transparent', cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                      <div style={{ fontSize: 20, marginBottom: 5 }}>{t.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: form.type === t.id ? 'var(--navy)' : 'var(--gray-600)', marginBottom: 3 }}>{t.label}</div>
                      <p style={{ fontSize: 10, color: 'var(--gray-400)', margin: 0, lineHeight: 1.4 }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Scenario Name" error={error}>
                  <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }} placeholder="e.g. Q4 Demand Surge +35%" />
                </FormField>
                <FormField label="Target Twin">
                  <select value={form.twinId} onChange={e => setForm(f => ({ ...f, twinId: e.target.value }))}>
                    {twins.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                  </select>
                </FormField>
                <FormField label="Direction">
                  <select value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                    <option value="increase">Increase</option>
                    <option value="decrease">Decrease</option>
                    <option value="disruption">Disruption</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </FormField>
                <FormField label="Intensity (%)" hint="How significant is this change?">
                  <input type="number" value={form.intensity} min="1" max="200" onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))} />
                </FormField>
                <FormField label="Horizon">
                  <select value={form.horizon} onChange={e => setForm(f => ({ ...f, horizon: e.target.value }))}>
                    {['30 days','60 days','90 days','180 days','1 year','2 years'].map(h => <option key={h}>{h}</option>)}
                  </select>
                </FormField>
                <FormField label="AI Describe (optional)" hint="Let FAIZ understand your intent">
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. competitor enters market, disrupting pricing" />
                </FormField>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Button variant="primary" onClick={runSimulation} icon="▷">Run AI Simulation</Button>
                <Button variant="secondary" onClick={() => setForm({ name: '', type: 'demand', description: '', twinId: activeTwinId, horizon: '90 days', intensity: '35', direction: 'increase' })}>Reset</Button>
              </div>
            </Card>
          )}

          {phase === 'running' && (
            <Card style={{ textAlign: 'center', padding: '48px 32px', marginBottom: 20 }}>
              <div style={{ marginBottom: 24 }}>
                <Spinner size={48} />
              </div>
              <h3 style={{ marginBottom: 8 }}>Running Simulation…</h3>
              <p style={{ color: 'var(--gray-400)', marginBottom: 28, fontSize: 13 }}>{currentStep}</p>
              <div style={{ maxWidth: 400, margin: '0 auto 16px', height: 8, borderRadius: 99, background: 'var(--gray-100)', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--navy), var(--teal))', borderRadius: 99, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{progress}% Complete</div>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                {SIM_STEPS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: progress >= Math.round((i + 1) / SIM_STEPS.length * 100) ? 'var(--emerald)' : 'var(--gray-200)' }} />
                    <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{s.replace('…', '')}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {phase === 'result' && result && (
            <div>
              {/* Result summary */}
              <Card style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                      <h3>{result.name}</h3>
                      <Badge label="Analysis Complete" variant="active" size="md" />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>{twin.name} · {result.duration} · {result.analysis?.confidence?.toFixed(1)}% confidence</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button variant="secondary" size="sm" onClick={() => setPhase('builder')} icon="←">New Scenario</Button>
                    <Button variant="primary" size="sm" icon="⊟">Export Report</Button>
                  </div>
                </div>

                {/* Impact grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    { label: 'Revenue Impact', value: result.analysis?.revenueImpact, icon: '💰', pos: result.analysis?.revenueImpact?.startsWith('+') },
                    { label: 'Risk Change',    value: result.analysis?.riskImpact,    icon: '⚠',  pos: result.analysis?.riskImpact?.startsWith('-') },
                    { label: 'Efficiency',     value: result.analysis?.efficiencyImpact, icon: '⚙', pos: result.analysis?.efficiencyImpact?.startsWith('+') },
                    { label: 'Confidence',     value: `${result.analysis?.confidence?.toFixed(1)}%`, icon: '◉', pos: true },
                  ].map(m => (
                    <div key={m.label} style={{ background: m.pos ? 'var(--emerald-light)' : m.label === 'Confidence' ? 'rgba(15,76,129,.06)' : 'var(--rose-light)', padding: '14px 16px', borderRadius: 'var(--r-lg)' }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: m.pos ? 'var(--emerald)' : m.label === 'Confidence' ? 'var(--navy)' : 'var(--rose)', marginBottom: 3 }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7, padding: '14px 16px', background: 'var(--off-white)', borderRadius: 10 }}>
                  <strong>FAIZ Analysis: </strong>{result.analysis?.summary}
                </p>
              </Card>

              {/* Forecast chart */}
              {result.analysis?.forecastPoints && (
                <Card style={{ marginBottom: 16 }}>
                  <h5 style={{ marginBottom: 14 }}>Forecast Trajectory · Base vs Scenario</h5>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={result.analysis.forecastPoints} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--gray-400)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--gray-400)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="scen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                      <Tooltip content={<ChartTooltip prefix="$" suffix="M" />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="base"     name="Baseline"  stroke="var(--gray-400)" strokeWidth={2} fill="url(#base)" />
                      <Area type="monotone" dataKey="scenario" name="Scenario"  stroke="var(--teal)"     strokeWidth={2.5} fill="url(#scen)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Risks + Recommendations */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card>
                  <h5 style={{ marginBottom: 12 }}>⚠ Key Risks</h5>
                  {result.analysis?.keyRisks?.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, padding: '8px 10px', background: 'var(--rose-light)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--rose)', fontWeight: 700, fontSize: 13 }}>{i + 1}</span>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.5 }}>{r}</p>
                    </div>
                  ))}
                </Card>
                <Card>
                  <h5 style={{ marginBottom: 12 }}>✓ Recommendations</h5>
                  {result.analysis?.recommendations?.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, padding: '8px 10px', background: 'var(--emerald-light)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--emerald)', fontWeight: 700, fontSize: 13 }}>{i + 1}</span>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.5 }}>{r}</p>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: History ── */}
        <div>
          <Card pad="0" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)' }}>
              <h5>Scenario History</h5>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: 0 }}>{scenarios.length} total scenarios</p>
            </div>
            <div style={{ maxHeight: 600, overflowY: 'auto' }}>
              {[...runningScenarios, ...completedScenarios].map(s => {
                const t = twins.find(tw => tw.id === s.twinId)
                return (
                  <div key={s.id} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => { setSelected(s); setDetailOpen(true) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{s.name}</span>
                      <Badge label={s.status} variant={statusBadge(s.status)} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 6 }}>{t?.name} · {s.duration}</div>
                    {s.results && (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 11, color: s.results.revenueChange >= 0 ? 'var(--emerald)' : 'var(--rose)', fontWeight: 600 }}>
                          {s.results.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(s.results.revenueChange).toFixed(1)}% revenue
                        </span>
                        {s.confidence && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.confidence.toFixed(1)}% conf.</span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Scenario detail modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selected?.name || 'Scenario Detail'} width={560}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[['Type', selected.type], ['Status', selected.status], ['Duration', selected.duration], ['Confidence', selected.confidence ? `${selected.confidence.toFixed(1)}%` : 'Pending']].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--off-white)', padding: '10px 14px', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.results && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {Object.entries(selected.results).map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: parseFloat(v) >= 0 ? 'var(--emerald-light)' : 'var(--rose-light)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--gray-500)', fontWeight: 600, marginBottom: 3, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: parseFloat(v) >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>{parseFloat(v) >= 0 ? '+' : ''}{parseFloat(v).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
