// ── Time Series Generator ─────────────────────────────────────
export function generateTimeSeries(base, length = 24, growth = 0.008, noise = 0.06) {
  return Array.from({ length }, (_, i) => {
    const trend  = base * Math.pow(1 + growth, i)
    const season = Math.sin((i / 12) * 2 * Math.PI) * base * 0.05
    const noiseV = (Math.random() - 0.5) * base * noise
    return Math.max(0, trend + season + noiseV)
  })
}

// ── Revenue Chart Data ────────────────────────────────────────
export function revenueChartData(twin) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const base = twin.revenue / 1e6
  const series = generateTimeSeries(base * 0.78, 12, 0.015, 0.04)
  return months.map((m, i) => ({
    month: m,
    actual:   i < 5 ? parseFloat(series[i].toFixed(2)) : null,
    forecast: i >= 4 ? parseFloat((series[i] * (1 + Math.random() * 0.03)).toFixed(2)) : null,
    target:   parseFloat((base * (0.8 + i * 0.018)).toFixed(2)),
  }))
}

// ── KPI Trend Data ────────────────────────────────────────────
export function kpiTrendData(metric, current, length = 30) {
  const pts = generateTimeSeries(current * 0.85, length, 0.005, 0.03)
  const now  = new Date()
  return pts.map((v, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (length - i))
    return {
      date:  `${d.getMonth() + 1}/${d.getDate()}`,
      value: parseFloat(v.toFixed(2)),
    }
  })
}

// ── Risk Heatmap Data ─────────────────────────────────────────
export function riskData() {
  const categories = ['Supply', 'Demand', 'Finance', 'Operations', 'Compliance', 'Cyber']
  const levels     = ['Critical','High','Medium','Low']
  return categories.map(cat => ({
    category: cat,
    data: levels.map(l => ({
      level: l,
      value: Math.floor(Math.random() * 10),
      color: l === 'Critical' ? '#d94f5c' : l === 'High' ? '#e8860a' : l === 'Medium' ? '#e3b341' : '#1a8a5c',
    })),
  }))
}

// ── Anomaly Feed ──────────────────────────────────────────────
export function anomalyFeed(count = 8) {
  const types    = ['revenue_spike','cost_anomaly','demand_shift','supply_gap','efficiency_drop','risk_surge']
  const severities = ['critical','high','medium','low']
  const mins = ['1','3','5','8','12','18','24','30','45','60']
  return Array.from({ length: count }, (_, i) => ({
    id: `anom_${i+1}`,
    type: types[i % types.length],
    severity: severities[Math.floor(Math.random() * 4)],
    value: (Math.random() * 3 + 0.5).toFixed(2) + 'σ',
    description: [
      'Revenue deviation exceeds 2.4σ threshold in North region',
      'Procurement cost anomaly: +18% vs 90-day average',
      'Demand signal shift detected in SKU cluster B7',
      'Supplier lead time variance at 99th percentile',
      'Warehouse efficiency dropped 12% vs daily baseline',
      'Portfolio VaR breached 95% confidence interval',
      'Patient admission surge pattern: 2.1× expected volume',
      'Store foot traffic anomaly: -34% without seasonal cause',
    ][i % 8],
    time: mins[i % mins.length] + 'm ago',
    acknowledged: i > 4,
  }))
}

// ── Simulation Progress Steps ─────────────────────────────────
export const SIM_STEPS = [
  'Initializing digital twin snapshot…',
  'Loading historical data (36 months)…',
  'Calibrating AI forecasting models…',
  'Running Monte Carlo simulations (10,000 paths)…',
  'Computing scenario impact vectors…',
  'Applying risk adjustment factors…',
  'Generating recommendation engine output…',
  'Compiling final analysis report…',
]

// ── Format Helpers ────────────────────────────────────────────
export const fmt = {
  currency: (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${n}`,
  pct:      (n, decimals = 1) => `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`,
  num:      (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : n.toString(),
  score:    (n) => `${n.toFixed(1)}`,
}

// ── Color by value ────────────────────────────────────────────
export const colorByDelta = (v) => parseFloat(v) >= 0 ? 'var(--emerald)' : 'var(--rose)'
export const colorByRisk  = (v) => v < 20 ? 'var(--emerald)' : v < 50 ? 'var(--amber)' : 'var(--rose)'
export const colorByHealth = (v) => v >= 85 ? 'var(--emerald)' : v >= 65 ? 'var(--amber)' : 'var(--rose)'
