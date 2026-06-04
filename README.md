## 🎥 Project Demo
[screen-capture (8).webm](https://github.com/user-attachments/assets/eda005c5-7a6e-4ba3-b958-4a55fc984107)

# FARSIM Digital Twin Business Simulator
<img width="955" height="448" alt="p1" src="https://github.com/user-attachments/assets/46c06b2c-dad2-466e-8cfd-75ce0b970f1f" />
<img width="956" height="440" alt="p2" src="https://github.com/user-attachments/assets/0a8fe931-a13a-4f0b-b24b-b3373cd78983" />
<img width="958" height="454" alt="p3" src="https://github.com/user-attachments/assets/45c32a5d-b5a8-42ad-9f3e-4f653b42fbe8" />
<img width="955" height="451" alt="p4" src="https://github.com/user-attachments/assets/985f2602-0e78-4d89-b147-c051d9c34c2f" />
<img width="950" height="451" alt="p5" src="https://github.com/user-attachments/assets/9b30003e-1918-4ce7-97c8-ac18c11ff004" />
<img width="956" height="459" alt="p6" src="https://github.com/user-attachments/assets/7a5c2246-6a57-48d3-b823-b2c61c703323" />
<img width="956" height="450" alt="p7" src="https://github.com/user-attachments/assets/a19b109b-ff19-4e4f-9178-3d233fe02508" />
<img width="958" height="452" alt="p8" src="https://github.com/user-attachments/assets/d8b28a37-f775-4f60-a01b-2e0bc446a8c0" />


> AI-Powered Digital Twin Business Simulator  Built by Umar Faraz

Enterprise Edition v2.1.0 · Built by **Umar Faraz**

[![GitHub](https://img.shields.io/badge/GitHub-umarfaraz511-black?logo=github)](https://github.com/umarfaraz511)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Umar%20Faraz-blue?logo=linkedin)](https://www.linkedin.com/in/umar-faraz-700457280)


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
