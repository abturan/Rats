import React from 'react'
export default function Section({ title, children, right }) {
  return (
    <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3"><h2 className="text-zinc-200 font-semibold tracking-wide">{title}</h2>{right}</div>
      {children}
    </div>
  )
}
