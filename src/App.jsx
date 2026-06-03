import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import { Spinner } from './components/ui/index.jsx'
import { AnomaliesPage, ReportsPage } from './pages/OtherPages.jsx'

const Dashboard     = lazy(() => import('./pages/Dashboard.jsx'))
const TwinsPage     = lazy(() => import('./pages/TwinsPage.jsx'))
const SimulatePage  = lazy(() => import('./pages/SimulatePage.jsx'))
const ForecastPage  = lazy(() => import('./pages/ForecastPage.jsx'))
const ModelsPage    = lazy(() => import('./pages/ModelsPage.jsx'))
const AssistantPage = lazy(() => import('./pages/AssistantPage.jsx'))

function PageLoader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:16 }}>
      <Spinner size={36} />
      <p style={{ color:'var(--gray-400)', fontSize:13 }}>Loading module…</p>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/twins"     element={<TwinsPage />} />
          <Route path="/simulate"  element={<SimulatePage />} />
          <Route path="/forecast"  element={<ForecastPage />} />
          <Route path="/anomalies" element={<AnomaliesPage />} />
          <Route path="/models"    element={<ModelsPage />} />
          <Route path="/reports"   element={<ReportsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*"          element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
