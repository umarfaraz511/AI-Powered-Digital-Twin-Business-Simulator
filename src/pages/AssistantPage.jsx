import React, { useState, useRef, useEffect } from 'react'
import { useTwinStore } from '../store/index.js'
import { dtbsChat } from '../services/groqService.js'
import { Button, Card, Badge, Spinner } from '../components/ui/index.jsx'

const SUGGESTED = [
  'What are the top risks for this twin right now?',
  'Give me a 3-point revenue growth strategy',
  'Analyze the current anomalies and explain them',
  'What scenario should I simulate next?',
  'Compare efficiency vs risk for all twins',
  'Predict next quarter revenue with confidence intervals',
]

export default function AssistantPage() {
  const { twins, activeTwinId } = useTwinStore()
  const [twinId, setTwinId] = useState(activeTwinId)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm **FAIZ** â€” your AI Business Analyst for FARSIM.\n\nI have full context on all your digital replicas and their predictive models. Ask me anything about revenue forecasting, risk analysis, scenario planning, or operational insights.\n\nWhich twin would you like to analyze?`, time: 'now' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const twin = twins.find(t => t.id === twinId)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg, time: 'now' }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    try {
      const reply = await dtbsChat(twin, messages, msg)
      setMessages(m => [...m, { role: 'assistant', content: reply, time: 'just now' }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `I encountered an error: ${e.message}. Please try again.`, time: 'just now', error: true }])
    }
    setLoading(false)
  }

  const renderContent = (text) => {
    // Simple markdown: **bold** and newlines
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ margin: line.trim() === '' ? '6px 0' : '0 0 5px', lineHeight: 1.65, fontSize: 13 }}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
    ))
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 22, height: 'calc(100vh - 180px)' }}>

      {/* Chat panel */}
      <Card pad="0" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(15,76,129,.04) 0%, rgba(26,155,138,.04) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>âœ¦</div>
            <div>
              <h4 style={{ marginBottom: 2 }}>FAIZ Â· AI Business Analyst</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Powered by Groq LLaMA Â· Online</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={twinId} onChange={e => setTwinId(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 12, background: 'var(--surface)', color: 'var(--gray-600)' }}>
              {twins.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
            </select>
            <Button variant="secondary" size="sm" onClick={() => setMessages([messages[0]])}>Clear</Button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} className="slide-in" style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginTop: 2 }}>âœ¦</div>
              )}
              <div style={{
                maxWidth: '74%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? '#0ea5e9' : msg.error ? 'var(--rose-light)' : 'var(--off-white)', color: msg.role === 'user' ? '#ffffff' : 'var(--gray-700)',
                color: msg.role === 'user' ? '#fff' : msg.error ? 'var(--rose)' : 'var(--gray-700)',
                boxShadow: 'var(--shadow-xs)',
              }}>
                {renderContent(msg.content)}
                <div style={{ fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,.5)' : 'var(--gray-400)', marginTop: 6, textAlign: 'right' }}>{msg.time}</div>
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', flexShrink: 0, marginTop: 2 }}>U</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--navy), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>âœ¦</div>
              <div style={{ padding: '12px 16px', background: 'var(--off-white)', borderRadius: '18px 18px 18px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Spinner size={16} />
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>FAIZ is thinkingâ€¦</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', borderTop: '1.5px solid var(--border)', background: 'var(--off-white)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask FAIZ anything about your digital twinsâ€¦"
              disabled={loading}
              style={{ flex: 1, borderRadius: 12, border: '1.5px solid var(--border)', padding: '10px 16px', fontSize: 13, background: 'var(--surface)' }}
            />
            <Button variant="primary" onClick={() => send()} disabled={!input.trim()} loading={loading} icon="â†’">Send</Button>
          </div>
        </div>
      </Card>

      {/* Right panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Twin context */}
        <Card>
          <h5 style={{ marginBottom: 12 }}>Active Twin Context</h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px', background: 'var(--off-white)', borderRadius: 10 }}>
            <span style={{ fontSize: 24 }}>{twin.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{twin.name}</div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{twin.industry}</div>
            </div>
          </div>
          {[
            ['Health',    `${twin.health}%`],
            ['Accuracy',  `${twin.accuracy}%`],
            ['Anomalies', twin.kpis.anomalies],
            ['Risk Score',twin.kpis.riskScore],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
              <span style={{ color: 'var(--gray-400)' }}>{l}</span>
              <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Suggestions */}
        <Card>
          <h5 style={{ marginBottom: 12 }}>Suggested Questions</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {SUGGESTED.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                style={{ textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--off-white)', cursor: 'pointer', fontSize: 11, color: 'var(--gray-600)', lineHeight: 1.4, transition: 'all var(--t-fast)', fontFamily: 'var(--font-sans)' }}>
                {s}
              </button>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <h5 style={{ marginBottom: 10 }}>Session Stats</h5>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--gray-400)' }}>Messages sent</span>
            <span style={{ fontWeight: 600 }}>{messages.filter(m => m.role === 'user').length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 5 }}>
            <span style={{ color: 'var(--gray-400)' }}>Model</span>
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 10 }}>llama3-8b</span>
          </div>
        </Card>
      </div>
    </div>
  )
}


