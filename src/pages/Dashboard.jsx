import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { useTwinStore, useAuthStore } from '../store/index.js'
import { revenueChartData, anomalyFeed, fmt, colorByHealth, colorByRisk } from '../utils/dataUtils.js'
import { KPICard, Card, Badge, Button, SectionHeader, ProgressBar, ChartTooltip, StatRow } from '../components/ui/index.jsx'

const HEALTH_GRADIENT = [[100,'#1a8a5c'],[80,'#e8860a'],[0,'#d94f5c']]
function healthColor(v) { return v >= 85 ? 'var(--emerald)' : v >= 65 ? 'var(--amber)' : 'var(--rose)' }

export default function Dashboard() {
  const { user } = useAuthStore()
  const { twins, setActiveTwin } = useTwinStore()
  const navigate = useNavigate()
  const [anomalies] = useState(() => anomalyFeed(6))
  const [selectedTwin, setSelectedTwin] = useState(twins[0])

  // Revenue chart data
  const revData = revenueChartData(selectedTwin)

  // Radar data for twin KPIs
  const radarData = [
    { metric: 'Efficiency',   value: selectedTwin.kpis.efficiency   },
    { metric: 'Forecast',     value: selectedTwin.kpis.forecastConfidence },
    { metric: 'Health',       value: selectedTwin.health            },
    { metric: 'Accuracy',     value: selectedTwin.accuracy          },
    { metric: 'Risk Safety',  value: 100 - selectedTwin.kpis.riskScore   },
  ]

  // All twins aggregate KPIs
  const totalRevenue  = twins.reduce((a, t) => a + t.revenue, 0)
  const avgAccuracy   = (twins.reduce((a, t) => a + t.accuracy, 0) / twins.length).toFixed(1)
  const totalSims     = twins.reduce((a, t) => a + t.simulations, 0)
  const totalAnomalies = twins.reduce((a, t) => a + t.kpis.anomalies, 0)

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 6 }}>Command Center</h1>
        <p style={{ fontSize: 15, color: 'var(--gray-400)' }}>
          Good morning, <strong style={{ color: 'var(--gray-600)' }}>{user?.name}</strong> · {selectedTwin.simulations} simulations run · Last sync {selectedTwin.lastSync}
        </p>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="delay-1">
        <KPICard label="Total Revenue (Simulated)" value={fmt.currency(totalRevenue)} delta={8.4} deltaLabel="vs last quarter" icon="💰" color="var(--navy)" />
        <KPICard label="Avg Model Accuracy" value={`${avgAccuracy}%`} delta={1.2} deltaLabel="improvement" icon="◉" color="var(--teal)" />
        <KPICard label="Simulations Run" value={fmt.num(totalSims)} delta={22.8} deltaLabel="this month" icon="▷" color="var(--violet)" />
        <KPICard label="Active Anomalies" value={totalAnomalies} delta={-3} deltaLabel="vs yesterday" icon="⚠" color="var(--amber)" />
      </div>

      {/* Twin Selector + Revenue Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, marginBottom: 20 }}>

        {/* Twin list */}
        <Card pad="0" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1.5px solid var(--border)' }}>
            <h5 style={{ marginBottom: 1 }}>Digital Twins</h5>
            <p style={{ fontSize: 11, color: 'var(--gray-400)', margin: 0 }}>{twins.length} active replicas</p>
          </div>
          {twins.map(t => (
            <div key={t.id} onClick={() => { setSelectedTwin(t); setActiveTwin(t.id) }}
              style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedTwin.id === t.id ? 'linear-gradient(90deg, rgba(15,76,129,.06) 0%, transparent 100%)' : 'transparent', borderLeft: selectedTwin.id === t.id ? '3px solid var(--navy)' : '3px solid transparent', transition: 'all var(--t-fast)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{t.name}</span>
                </div>
                <Badge label={t.status === 'active' ? 'Live' : 'Warning'} variant={t.status === 'active' ? 'active' : 'warning'} />
              </div>
              <ProgressBar value={t.health} color={healthColor(t.health)} height={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{t.industry}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: healthColor(t.health) }}>{t.health}% health</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Revenue + Forecast chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h4 style={{ marginBottom: 3 }}>Revenue · Actual vs Forecast</h4>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>{selectedTwin.name} · FY 2025 · {fmt.currency(selectedTwin.revenue)}</p>
            </div>
            <Badge label={`${selectedTwin.kpis.forecastConfidence}% confidence`} variant="navy" size="md" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--navy)"  stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--navy)"  stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="revForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--teal)"  stopOpacity={0.2}  />
                  <stop offset="95%" stopColor="var(--teal)"  stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip content={<ChartTooltip prefix="$" suffix="M" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="actual"   name="Actual"   stroke="var(--navy)" strokeWidth={2.5} fill="url(#revActual)"   connectNulls={false} dot={{ r: 3, fill: 'var(--navy)' }} />
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="var(--teal)" strokeWidth={2} fill="url(#revForecast)" connectNulls={false} strokeDasharray="5 3" dot={{ r: 2, fill: 'var(--teal)' }} />
              <Area type="monotone" dataKey="target"   name="Target"   stroke="var(--gray-300)" strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* KPI Radar + Anomaly Feed + Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Radar */}
        <Card>
          <h5 style={{ marginBottom: 14 }}>Twin Health Radar</h5>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--gray-500)' }} />
              <Radar dataKey="value" stroke="var(--navy)" fill="var(--navy)" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
            {[['Accuracy', `${selectedTwin.accuracy}%`], ['Health', `${selectedTwin.health}%`], ['Confidence', `${selectedTwin.kpis.forecastConfidence}%`]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--gray-800)' }}>{v}</div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Anomaly Feed */}
        <Card pad="0" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5>Anomaly Feed</h5>
            <Button variant="ghost" size="sm" onClick={() => navigate('/anomalies')}>View all</Button>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {anomalies.map(a => {
              const sev = { critical: 'danger', high: 'warning', medium: 'navy', low: 'default' }[a.severity]
              return (
                <div key={a.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, opacity: a.acknowledged ? 0.55 : 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: { critical: 'var(--rose)', high: 'var(--amber)', medium: 'var(--navy)', low: 'var(--gray-400)' }[a.severity], marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Badge label={a.severity.toUpperCase()} variant={sev} />
                      <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>{a.time}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--gray-600)', margin: 0, lineHeight: 1.4 }} className="truncate">{a.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Quick actions + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <h5 style={{ marginBottom: 14 }}>Quick Actions</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="primary" onClick={() => navigate('/simulate')} icon="▷" style={{ justifyContent: 'flex-start' }}>Run New Simulation</Button>
              <Button variant="secondary" onClick={() => navigate('/twins')} icon="◈" style={{ justifyContent: 'flex-start' }}>Manage Twins</Button>
              <Button variant="ghost" onClick={() => navigate('/forecast')} icon="〜" style={{ justifyContent: 'flex-start' }}>Generate Forecast</Button>
              <Button variant="secondary" onClick={() => navigate('/assistant')} icon="✦" style={{ justifyContent: 'flex-start' }}>Ask FAIZ</Button>
            </div>
          </Card>

          <Card pad="0" style={{ overflow: 'hidden' }}>
            <StatRow items={[
              { label: 'Data Points', value: fmt.num(selectedTwin.dataPoints) },
              { label: 'Simulations', value: selectedTwin.simulations },
            ]} />
            <div style={{ padding: '12px 18px', borderTop: '1.5px solid var(--border)' }}>
              <ProgressBar value={selectedTwin.kpis.efficiency} label="Operational Efficiency" color="var(--teal)" height={6} />
              <div style={{ marginTop: 10 }}>
                <ProgressBar value={100 - selectedTwin.kpis.riskScore} label="Risk Safety Score" color={100 - selectedTwin.kpis.riskScore > 60 ? 'var(--emerald)' : 'var(--rose)'} height={6} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Twins overview table */}
      <Card pad="0" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>All Digital Twins Overview</h5>
          <Button variant="secondary" size="sm" onClick={() => navigate('/twins')} icon="→">Manage</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--off-white)' }}>
                {['Twin', 'Industry', 'Health', 'Accuracy', 'Revenue', 'Risk', 'Simulations', 'Status', 'Last Sync'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '1.5px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {twins.map((t, i) => (
                <tr key={t.id} onClick={() => navigate('/twins')} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--off-white)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: t.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{fmt.num(t.dataPoints)} data points</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-500)' }}>{t.industry}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--gray-100)', minWidth: 60 }}>
                        <div style={{ width: `${t.health}%`, height: '100%', borderRadius: 99, background: healthColor(t.health) }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: healthColor(t.health), minWidth: 32 }}>{t.health}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{t.accuracy}%</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
                    {fmt.currency(t.revenue)}
                    <span style={{ fontSize: 11, marginLeft: 5, color: t.revenueGrowth >= 0 ? 'var(--emerald)' : 'var(--rose)', fontWeight: 600 }}>
                      {t.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(t.revenueGrowth)}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colorByRisk(t.kpis.riskScore) }}>{t.kpis.riskScore}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>{t.simulations}</td>
                  <td style={{ padding: '12px 16px' }}><Badge label={t.status === 'active' ? 'Active' : 'Warning'} variant={t.status === 'active' ? 'active' : 'warning'} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-400)' }}>{t.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
