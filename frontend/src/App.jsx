import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur bg-white/60 border-b border-black/5">
      <div className="text-xl font-semibold tracking-tight">AiroboTrade</div>
      <nav className="hidden md:flex gap-6 text-sm text-gray-700">
        <a href="#features" className="hover:text-black transition">Features</a>
        <a href="#demo" className="hover:text-black transition">Demo</a>
        <a href="#cta" className="hover:text-black transition">Get Started</a>
      </nav>
      <button className="px-4 py-2 rounded-md bg-black text-white text-sm">Sign In</button>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/M4yE7MTeWshitQbr/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black">AI Robot Trading Platform</h1>
          <p className="mt-4 text-gray-700 md:text-lg">A playful, interactive robot that helps you research, simulate, and automate strategies across markets. Paper trade now; connect live accounts next.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#demo" className="px-5 py-3 rounded-md bg-black text-white">Try Paper Trading</a>
            <a href="#features" className="px-5 py-3 rounded-md border border-gray-300">Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{desc}</p>
    </div>
  )
}

function Features() {
  const list = [
    { title: 'Strategy Builder', desc: 'Define symbols, timeframes, and risk per trade with a clean, simple flow.' },
    { title: 'Signal Inbox', desc: 'Generate buy/sell signals and track confidence levels.' },
    { title: 'Paper Trading', desc: 'Simulate positions and PnL with zero risk using our backend.' },
  ]
  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-4xl font-bold text-black">What you can do today</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((item) => <FeatureCard key={item.title} title={item.title} desc={item.desc} />)}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', symbol: 'BTCUSDT', timeframe: '1h', risk_per_trade: 0.01 })

  const fetchStrategies = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/strategies`)
      const data = await res.json()
      setStrategies(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchStrategies()
  }, [])

  const createStrategy = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/strategies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to create strategy')
      setForm({ name: '', description: '', symbol: 'BTCUSDT', timeframe: '1h', risk_per_trade: 0.01 })
      await fetchStrategies()
    } catch (e) {
      console.error(e)
      alert('Unable to create strategy right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-4xl font-bold text-black">Paper trading demo</h2>
        <p className="mt-2 text-gray-600">Create a strategy and we will store it. This is a safe, simulated experience — no real orders are sent.</p>

        <form onSubmit={createStrategy} className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-4">
          <input className="md:col-span-2 px-3 py-2 border rounded-md" placeholder="Strategy name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <input className="md:col-span-2 px-3 py-2 border rounded-md" placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          <input className="px-3 py-2 border rounded-md" placeholder="Symbol" value={form.symbol} onChange={e => setForm(f => ({...f, symbol: e.target.value}))} required />
          <input className="px-3 py-2 border rounded-md" placeholder="Timeframe" value={form.timeframe} onChange={e => setForm(f => ({...f, timeframe: e.target.value}))} required />

          <div className="md:col-span-2 flex items-center gap-2">
            <label className="text-sm text-gray-600">Risk per trade</label>
            <input type="number" step="0.001" min="0" max="1" className="px-3 py-2 border rounded-md w-full" value={form.risk_per_trade} onChange={e => setForm(f => ({...f, risk_per_trade: parseFloat(e.target.value)}))} />
          </div>
          <div className="md:col-span-4 flex items-center">
            <button disabled={loading} className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create strategy'}</button>
          </div>
        </form>

        <div className="mt-10">
          <h3 className="font-semibold text-lg">Saved strategies</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map(s => (
              <div key={s.id} className="p-4 border rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-600">{s.symbol} • {s.timeframe}</div>
                  </div>
                  <span className={"text-xs px-2 py-1 rounded-full " + (s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}>{s.status}</span>
                </div>
                {s.description && <p className="mt-2 text-sm text-gray-600">{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="cta" className="py-16 md:py-24 bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">Ready to build your own AI trader?</h2>
        <p className="mt-3 text-white/80">Start with paper trading today. Live exchange connections are coming next.</p>
        <div className="mt-6">
          <a href="#demo" className="px-6 py-3 rounded-md bg-white text-black font-medium">Get started</a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <Hero />
      <Features />
      <Demo />
      <CTA />
      <footer className="py-8 text-center text-sm text-gray-600">For educational use only. This demo does not execute live trades.</footer>
    </div>
  )
}
