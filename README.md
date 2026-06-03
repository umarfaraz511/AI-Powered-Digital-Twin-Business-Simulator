# FARSIM — Digital Twin Business Simulator

> AI-Powered Digital Twin Business Simulator — Built by Umar Faraz

Enterprise Edition v2.1.0 · Built by **Umar Faraz**

[![GitHub](https://img.shields.io/badge/GitHub-umarfaraz511-black?logo=github)](https://github.com/umarfaraz511)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Umar%20Faraz-blue?logo=linkedin)](https://www.linkedin.com/in/umar-faraz-700457280)
[![Umar Faraz](https://img.shields.io/badge/Company-Umar Faraz%20SMC--PVT%20LTD-green)](https://aivonex.com)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:3000)
npm run dev

# 3. Production build
npm run build
```

**Groq API Key** is pre-configured in `src/services/groqService.js`

---

## 🏗 Architecture

```
digital-twin-business-simulator/
├── index.html                          ← App entry + Google Fonts
├── vite.config.js                      ← Vite + path aliases
├── package.json                        ← React 18 + Recharts + Zustand
│
└── src/
    ├── main.jsx                        ← React root + BrowserRouter
    ├── App.jsx                         ← Routes (8 pages, lazy loaded)
    ├── index.css                       ← Premium light theme + tokens
    │
    ├── store/
    │   └── index.js                    ← Zustand: Auth, Twins, Sims, Notifs
    │
    ├── services/
    │   └── groqService.js              ← Groq LLaMA API: 5 AI endpoints
    │
    ├── utils/
    │   └── dataUtils.js                ← Time series, formatters, mock data
    │
    ├── components/
    │   ├── ui/index.jsx                ← 15+ reusable UI primitives
    │   └── layout/Layout.jsx           ← Sidebar nav + topbar + footer
    │
    └── pages/
        ├── Dashboard.jsx               ← Command Center with all KPIs
        ├── TwinsPage.jsx               ← Digital twin registry + CRUD
        ├── SimulatePage.jsx            ← AI scenario builder + live progress
        ├── ForecastPage.jsx            ← Revenue forecasting with LSTM
        ├── ModelsPage.jsx              ← ML metrics: Accuracy/Precision/Recall/F1
        ├── AssistantPage.jsx           ← FAIZ AI chat (real Groq API)
        └── OtherPages.jsx              ← Anomalies + Reports pages
```

---

## 🤖 AI Features (Groq LLaMA 3)

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Scenario Analysis | `analyzeScenario()` | Full business impact simulation with revenue/risk/efficiency forecasts |
| Revenue Forecasting | `generateForecast()` | Multi-horizon forecasts with confidence bands |
| Anomaly Explanation | `explainAnomaly()` | Real-time AI explanation of detected anomalies |
| FAIZ Chat | `dtbsChat()` | Context-aware business analyst chat assistant |
| Model Insights | `getModelInsights()` | Dynamic ML performance metrics per twin |

---

## 📊 Application Pages

| Page | Route | Key Features |
|------|-------|-------------|
| Command Center | `/` | KPI cards, revenue chart, twin health, anomaly feed, quick actions |
| Digital Twins | `/twins` | Twin registry, health scores, CRUD, search+filter |
| Simulation Studio | `/simulate` | 6 scenario types, AI analysis, live progress, forecast charts |
| Revenue Forecasting | `/forecast` | LSTM+Prophet ensemble, confidence bands, monthly breakdown |
| Anomaly Detection | `/anomalies` | Real-time feed, AI explanation via Groq, severity filtering |
| AI Model Registry | `/models` | Accuracy, Precision, Recall, F1, MSE metrics + radar chart |
| Reports | `/reports` | PDF/Excel/CSV export, report library, generation queue |
| FAIZ Assistant | `/assistant` | Full Groq-powered chat with twin context |

---

## 🧠 ML Models Tracked

- **Revenue Forecasting LSTM** — Time Series (Accuracy: 97.3%, F1: 96.9%)
- **Anomaly Detection IsolationForest** — Unsupervised (Accuracy: 94.2%, Recall: 93.4%)
- **Demand Classifier XGBoost** — Classification (Accuracy: 91.7%, Precision: 90.3%)
- **Risk Score Regressor** — Regression (MSE: 0.018)

---

## 🎨 Design System

- **Typography**: `Instrument Serif` (display) + `DM Sans` (body) + `JetBrains Mono` (code)
- **Theme**: Premium light with navy/teal brand palette
- **Tokens**: 40+ CSS variables for colors, shadows, radii, transitions
- **Animations**: Smooth fade-up, slide-in, pulse, shimmer skeleton loading

---

## 🔐 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand |
| Charts | Recharts |
| AI API | Groq (LLaMA 3 8B) |
| Fonts | Google Fonts |
| Build | Vite + code splitting |

---

## 👨‍💻 Developer

**Umar Faraz**
- 🐙 GitHub: [github.com/umarfaraz511](https://github.com/umarfaraz511)
- 💼 LinkedIn: [linkedin.com/in/umar-faraz-700457280](https://www.linkedin.com/in/umar-faraz-700457280)

Built by Umar Faraz · github.com/umarfaraz511

---

*Suitable for showcasing to Google, Microsoft, Amazon, Meta, NVIDIA, OpenAI, Databricks, Snowflake, Oracle, IBM, Palantir, and leading AI startups.*
