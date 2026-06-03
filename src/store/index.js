import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: { name: 'Umar Faraz', role: 'Enterprise Admin', initials: 'UF' },
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'farsim-auth' }
  )
)

export const useTwinStore = create(
  persist(
    (set, get) => ({
      twins: [
        { id: 't1', name: 'NexaCore Supply Chain', industry: 'Manufacturing', icon: '🏭', status: 'active', health: 94, accuracy: 97.3, revenue: 4800000, simulations: 142, lastSync: '2 min ago', dataPoints: 2400000, kpis: { efficiency: 91, riskScore: 12, forecastConfidence: 94, anomalies: 3 } },
        { id: 't2', name: 'RetailChain Analytics', industry: 'Retail', icon: '🛒', status: 'active', health: 87, accuracy: 94.2, revenue: 3200000, simulations: 98, lastSync: '5 min ago', dataPoints: 1800000, kpis: { efficiency: 85, riskScore: 18, forecastConfidence: 89, anomalies: 7 } },
        { id: 't3', name: 'MedTech Operations', industry: 'Healthcare', icon: '🏥', status: 'active', health: 96, accuracy: 96.1, revenue: 6100000, simulations: 201, lastSync: '1 min ago', dataPoints: 3100000, kpis: { efficiency: 94, riskScore: 8, forecastConfidence: 97, anomalies: 2 } },
        { id: 't4', name: 'FinServ Risk Model', industry: 'Finance', icon: '💹', status: 'warning', health: 72, accuracy: 91.7, revenue: 8900000, simulations: 67, lastSync: '12 min ago', dataPoints: 950000, kpis: { efficiency: 78, riskScore: 34, forecastConfidence: 81, anomalies: 13 } },
      ],
      activeTwinId: 't1',
      setActiveTwin: (id) => set({ activeTwinId: id }),
      addTwin: (twin) => set((s) => ({ twins: [...s.twins, twin] })),
      updateTwin: (id, data) => set((s) => ({ twins: s.twins.map(t => t.id === id ? { ...t, ...data } : t) })),
      deleteTwin: (id) => set((s) => ({ twins: s.twins.filter(t => t.id !== id) })),
    }),
    { name: 'farsim-twins' }
  )
)

export const useSimStore = create(
  persist(
    (set) => ({
      scenarios: [],
      running: false,
      addScenario: (s) => set((st) => ({ scenarios: [s, ...st.scenarios] })),
      setRunning: (v) => set({ running: v }),
      completeScenario: (id, data) => set((st) => ({
        scenarios: st.scenarios.map(s => s.id === id ? { ...s, ...data, status: 'completed' } : s)
      })),
    }),
    { name: 'farsim-sims' }
  )
)

export const useNotifStore = create((set) => ({
  notifications: [
    { id: 1, read: false, text: 'NexaCore anomaly detected' },
    { id: 2, read: false, text: 'Forecast updated for FinServ' },
  ],
  markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  count: 2,
  clear: () => set({ count: 0 }),
}))
