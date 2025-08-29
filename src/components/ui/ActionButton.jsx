import React from 'react'
export default function ActionButton({ onClick, children, disabled, highlight }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-3 py-2 rounded-xl border text-sm mr-2 mb-2 ${disabled ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-500' : `border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 ${highlight ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}`}
    >{children}</button>
  )
}
