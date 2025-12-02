import React from 'react'
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow p-8 space-y-6">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black text-white font-bold">RT</span>
            <h1 className="text-2xl font-bold tracking-tight">React + Tailwind Starter</h1>
          </div>
          <p className="text-slate-600">
            Tailwind CSS is configured and working. Edit <code className="px-1 py-0.5 rounded bg-slate-100">src/App.jsx</code> and save to see changes.
          </p>
          <div className="flex items-center gap-4">
            <button className="btn bg-black text-white" onClick={() => setCount((c) => c + 1)}>
              Count: {count}
            </button>
            <a className="btn bg-slate-100" href="https://tailwindcss.com/docs" target="_blank" rel="noreferrer">
              Tailwind Docs
            </a>
          </div>
          <footer className="text-xs text-slate-500">
            Built with <span className="font-semibold">Vite</span>, <span className="font-semibold">React</span>, and <span className="font-semibold">Tailwind CSS</span>.
          </footer>
        </div>
      </div>
    </main>
  )
}
