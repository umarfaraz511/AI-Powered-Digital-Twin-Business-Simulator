import React, { useState, useEffect } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useTwinStore } from '../store/index.js'
import { getModelInsights } from '../services/groqService.js'
import { Button, Card, Badge, SectionHeader, Spinner, KPICard, ProgressBar, ChartTooltip } from '../components/ui/index.jsx'

const MODEL_COLORS = ['var(--navy)', 'var(--teal)', 'var(--violet)', 'var(--amber)']

export default function ModelsPage() {
  const { twins } = useTwinStore()
  const [twinId, setTwinId] = useState(twins[0].id)
  const [models, setModels] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const twin = twins.find(t => t.id === twinId)

  const loadModels = async () => {
    setLoading(true)
    const res = await getModelInsights(twin)
    setModels(res.models)
    setSelected(res.models[0])
    setLoading(false)
  }

  useEffect(() => { loadModels() }, [twinId])

  const radarData = selected ? [
    { metric: 'Accuracy',  value: selected.accuracy || 90  },
    { metric: 'Precision', value: selected.precision || 90 },
    { metric: 'Recall',    value: selected.recall || 90    },
    { metric: 'F1 Score',  value: selected.f1 || 90        },
    { metric: 'Speed',     value: 92                       },
    { metric: 'Robustness',value: 88                       },
  ] : []

  const barData = models?.map((m, i) => ({
    name: m.name.split(' ').slice(0, 2).join(' '),
    accuracy:  m.accuracy  || 0,
    precision: m.precision || 0,
    recall:    m.recall    || 0,
    f1:        m.f1        || 0,
  })) || []

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>AI Model Registry</h2>
          <p style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 4 }}>Monitor ML performance metrics: accuracy, precision, recall, F1, MSE</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={twinId} onChange={e => setTwinId(e.target.value)} style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--gray-700)' }}>
            {twins.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={loadModels} loading={loading} icon="↻">Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 16 }}>
          <Spinner size={40} />
          <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>Loading model metrics from FAIZ…</p>
        </div>
      ) : models && (
        <>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <KPICard label="Models Deployed" value={models.length}            icon="◉" color="var(--navy)" />
            <KPICard label="Avg Accuracy"    value={`${(models.reduce((a,m) => a+(m.accuracy||0),0)/models.filter(m=>m.accuracy).length).toFixed(1)}%`} icon="◈" color="var(--teal)" />
            <KPICard label="Production Ready" value={models.filter(m=>m.status==='production').length} icon="✓" color="var(--emerald)" />
            <KPICard label="Avg F1 Score"    value={`${(models.reduce((a,m) => a+(m.f1||0),0)/models.filter(m=>m.f1).length).toFixed(1)}%`}     icon="⭐" color="var(--violet)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 22, marginBottom: 22 }}>
            {/* Model list */}
            <Card pad="0" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)' }}>
                <h5>Registered Models</h5>
              </div>
              {models.map((m, i) => (
                <div key={i} onClick={() => setSelected(m)}
                  style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected?.name === m.name ? 'rgba(15,76,129,.05)' : 'transparent', borderLeft: selected?.name === m.name ? '3px solid var(--navy)' : '3px solid transparent', transition: 'all var(--t-fast)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{m.name.split(' ').slice(0,2).join(' ')}</span>
                    <Badge label={m.status} variant="active" />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Badge label={m.type} variant="navy" />
                    {m.accuracy && <span style={{ fontSize: 10, color: 'var(--emerald)', fontWeight: 600 }}>{m.accuracy}% acc</span>}
                    {m.mse      && <span style={{ fontSize: 10, color: 'var(--amber)',   fontWeight: 600 }}>MSE {m.mse}</span>}
                  </div>
                </div>
              ))}
            </Card>

            {/* Model detail */}
            {selected && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card>
                  <div style={{ marginBottom: 18 }}>
                    <h4 style={{ marginBottom: 5 }}>{selected.name}</h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Badge label={selected.type} variant="navy" size="md" />
                      <Badge label={selected.status} variant="active" size="md" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                    {[
                      { label: 'Accuracy',  value: selected.accuracy,  color: 'var(--navy)',    fmt: v => `${v}%`  },
                      { label: 'Precision', value: selected.precision, color: 'var(--teal)',    fmt: v => `${v}%`  },
                      { label: 'Recall',    value: selected.recall,    color: 'var(--violet)',  fmt: v => `${v}%`  },
                      { label: 'F1 Score',  value: selected.f1,        color: 'var(--emerald)', fmt: v => `${v}%`  },
                    ].map(m => (
                      <div key={m.label} style={{ background: 'var(--off-white)', padding: '16px', borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: m.value ? m.color : 'var(--gray-300)', marginBottom: 4 }}>
                          {m.value ? m.fmt(m.value) : 'N/A'}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                        {m.value && (
                          <div style={{ height: 3, borderRadius: 99, background: 'var(--gray-200)', marginTop: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${m.value}%`, height: '100%', borderRadius: 99, background: m.color }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selected.mse && (
                    <div style={{ marginTop: 14, padding: '12px 16px', background: 'var(--amber-light)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 20 }}>📉</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)' }}>Mean Squared Error: {selected.mse}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Regression metric — lower is better. Target MSE &lt; 0.05</div>
                      </div>
                    </div>
                  )}
                </Card>

                <Card>
                  <h5 style={{ marginBottom: 14 }}>Performance Radar</h5>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
                      <Radar dataKey="value" stroke="var(--navy)" fill="var(--navy)" fillOpacity={0.18} strokeWidth={2} dot={{ fill: 'var(--navy)', r: 3 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}
          </div>

          {/* Comparison bar chart */}
          <Card>
            <h5 style={{ marginBottom: 16 }}>Model Comparison · Classification Metrics (%)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={18} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="accuracy"  name="Accuracy"  fill="var(--navy)"   radius={[4,4,0,0]} />
                <Bar dataKey="precision" name="Precision" fill="var(--teal)"   radius={[4,4,0,0]} />
                <Bar dataKey="recall"    name="Recall"    fill="var(--violet)" radius={[4,4,0,0]} />
                <Bar dataKey="f1"        name="F1 Score"  fill="var(--emerald)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  )
}
