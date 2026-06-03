import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, ComposedChart, Bar, Line } from 'recharts'
import { useTwinStore } from '../store/index.js'
import { generateForecast } from '../services/groqService.js'
import { fmt, generateTimeSeries } from '../utils/dataUtils.js'
import { Button, Card, Badge, SectionHeader, FormField, Spinner, KPICard, ChartTooltip, ProgressBar } from '../components/ui/index.jsx'

export default function ForecastPage() {
  const { twins } = useTwinStore()
  const [twinId, setTwinId]     = useState(twins[0].id)
  const [horizon, setHorizon]   = useState('6 months')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')

  const twin = twins.find(t => t.id === twinId)

  const runForecast = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await generateForecast(twin, horizon)
      setResult(res)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  // Static historical data for the chart context
  const histData = Array.from({ length: 6 }, (_, i) => {
    const months = ['Dec','Jan','Feb','Mar','Apr','May']
    return { month: months[i], revenue: parseFloat((twin.revenue / 1e6 * (0.78 + i * 0.04)).toFixed(2)) }
  })

  const chartData = result
    ? [...histData.slice(-3).map(d => ({ ...d, historical: d.revenue })),
       ...result.forecast.map(f => ({
         month: f.month.slice(0, 3),
         forecast: f.revenue,
         lower: f.lowerBound,
         upper: f.upperBound,
         confidence: f.confidence,
       }))]
    : histData.map(d => ({ ...d, historical: d.revenue }))

  return (
    <div className="fade-in">
      <SectionHeader title="Revenue Forecasting" subtitle="AI-powered multi-horizon predictive analytics for any digital twin" />

      {/* Controls */}
      <Card style={{ marginBottom: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <FormField label="Digital Twin">
            <select value={twinId} onChange={e => { setTwinId(e.target.value); setResult(null) }}>
              {twins.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
            </select>
          </FormField>
          <FormField label="Forecast Horizon">
            <select value={horizon} onChange={e => setHorizon(e.target.value)}>
              {['3 months','6 months','12 months','24 months'].map(h => <option key={h}>{h}</option>)}
            </select>
          </FormField>
          <Button variant="primary" onClick={runForecast} loading={loading} icon="〜" style={{ marginBottom: 1 }}>
            Generate Forecast
          </Button>
        </div>
        {error && <p style={{ color: 'var(--rose)', fontSize: 12, marginTop: 8 }}>{error}</p>}
      </Card>

      {/* Twin context */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 22 }}>
        <KPICard label="Current Revenue" value={fmt.currency(twin.revenue)} delta={twin.revenueGrowth} deltaLabel="last quarter" icon="💰" />
        <KPICard label="Model Accuracy"  value={`${twin.accuracy}%`}        delta={1.1}               deltaLabel="improvement"  icon="◉"  color="var(--teal)" />
        <KPICard label="Forecast Conf."  value={`${twin.kpis.forecastConfidence}%`} icon="◈" color="var(--violet)" />
        <KPICard label="Twin Health"     value={`${twin.health}%`}          icon="⬡" color="var(--emerald)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22 }}>
        {/* Chart */}
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>Revenue Forecast · {twin.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>Historical + AI prediction with confidence bands</p>
              </div>
              {result && <Badge label={result.trend === 'upward' ? '↑ Upward trend' : result.trend === 'downward' ? '↓ Downward trend' : '→ Stable'} variant={result.trend === 'upward' ? 'active' : result.trend === 'downward' ? 'danger' : 'default'} size="md" />}
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, flexDirection: 'column', gap: 14 }}>
                <Spinner size={36} />
                <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>FAIZ is modeling your forecast…</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--navy)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--navy)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                  <Tooltip content={<ChartTooltip prefix="$" suffix="M" />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="historical" name="Historical" stroke="var(--navy)"    strokeWidth={2.5} fill="url(#histGrad)" connectNulls={false} />
                  <Area type="monotone" dataKey="upper"      name="Upper CI"   stroke="var(--gray-300)" strokeWidth={1}  fill="none" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="forecast"   name="Forecast"   stroke="var(--teal)"    strokeWidth={2.5} fill="url(#foreGrad)" strokeDasharray="5 3" />
                  <Area type="monotone" dataKey="lower"      name="Lower CI"   stroke="var(--gray-300)" strokeWidth={1}  fill="none" strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Forecast table */}
          {result && (
            <Card pad="0" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5>Monthly Forecast Breakdown</h5>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="secondary" size="sm" icon="⊟">Export CSV</Button>
                  <Button variant="secondary" size="sm" icon="⊟">Export PDF</Button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--off-white)' }}>
                    {['Period','Revenue Forecast','Lower Bound','Upper Bound','Confidence','vs Current'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1.5px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.forecast.map((f, i) => {
                    const delta = ((f.revenue - twin.revenue / 1e6) / (twin.revenue / 1e6)) * 100
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? 'var(--off-white)' : 'transparent' }}>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{f.month}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--gray-800)' }}>${f.revenue.toFixed(2)}M</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--gray-500)' }}>${f.lowerBound.toFixed(2)}M</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--gray-500)' }}>${f.upperBound.toFixed(2)}M</td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 50, height: 4, borderRadius: 99, background: 'var(--gray-100)' }}>
                              <div style={{ width: `${f.confidence}%`, height: '100%', borderRadius: 99, background: f.confidence > 85 ? 'var(--emerald)' : f.confidence > 70 ? 'var(--amber)' : 'var(--rose)' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)' }}>{f.confidence}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: delta >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
                          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result && (
            <Card>
              <h5 style={{ marginBottom: 12 }}>Forecast Insights</h5>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'var(--off-white)', borderRadius: 10 }}>
                  <div style={{ fontSize: 22, fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: 3 }}>{result.cagr}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>CAGR</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'var(--off-white)', borderRadius: 10 }}>
                  <div style={{ fontSize: 22, fontFamily: 'var(--font-serif)', color: result.trend === 'upward' ? 'var(--emerald)' : 'var(--rose)', marginBottom: 3 }}>
                    {result.trend === 'upward' ? '↑' : result.trend === 'downward' ? '↓' : '→'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>Trend</div>
                </div>
              </div>
              {result.insights?.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--off-white)', borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✦</span>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.5 }}>{ins}</p>
                </div>
              ))}
            </Card>
          )}

          <Card>
            <h5 style={{ marginBottom: 12 }}>Model Performance</h5>
            <ProgressBar value={twin.accuracy} label="Forecast Model Accuracy" color="var(--navy)" height={6} />
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={twin.kpis.forecastConfidence} label="Confidence Score" color="var(--teal)" height={6} />
            </div>
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={twin.health} label="Twin Health" color={twin.health >= 85 ? 'var(--emerald)' : 'var(--amber)'} height={6} />
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(15,76,129,.06)', borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--navy)' }}>LSTM + Prophet ensemble</strong> trained on {fmt.num(twin.dataPoints)} data points across {twin.industry} vertical. Retrained weekly with drift detection.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
