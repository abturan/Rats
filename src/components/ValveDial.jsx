// src/components/ValveDial.jsx
import React from 'react'

/**
 * Döner vana tarzı eylem seçici.
 * props.options = [{id, label, onSelect, disabled}]
 */
export default function ValveDial({ options=[], size=160 }) {
  const [idx, setIdx] = React.useState(0)
  const active = options[idx] || {}
  const r = size/2
  const ring = r - 14
  const seg = (2*Math.PI)/Math.max(1, options.length)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{ width:size, height:size }}
        aria-label="Eylem Seçici Vana"
      >
        {/* arka daire */}
        <div className="absolute inset-0 rounded-full bg-zinc-900/70 border border-zinc-700 shadow-inner" />
        {/* segmentler */}
        {options.map((o, i)=>{
          const a0 = -Math.PI/2 + i*seg
          const a1 = a0 + seg
          const mid = (a0+a1)/2
          const x = r + Math.cos(mid) * (ring-22)
          const y = r + Math.sin(mid) * (ring-22)
          return (
            <button
              key={o.id}
              title={o.label}
              onClick={()=>setIdx(i)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full border ${i===idx?'border-emerald-500 bg-emerald-900/30':'border-zinc-600 bg-zinc-800/40'} ${o.disabled?'opacity-40 cursor-not-allowed':''}`}
              style={{ left:x, top:y }}
              disabled={o.disabled}
            >
              {o.label}
            </button>
          )
        })}
        {/* kol */}
        <div
          className="absolute left-1/2 top-1/2 origin-left w-[calc(50%-18px)] h-[6px] rounded-full bg-emerald-500/70"
          style={{ transform:`translate(-50%,-50%) rotate(${(idx/options.length)*360}deg)` }}
        />
        {/* merkez düğme */}
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-zinc-950 border border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,.25)] text-xs"
          onClick={()=>active?.onSelect?.()}
          disabled={!!active?.disabled}
        >
          ÇEVİR
        </button>
      </div>
      {/* erişilebilirlik için alt menü */}
      <div className="flex flex-wrap gap-2">
        {options.map((o,i)=>(
          <button key={o.id} onClick={()=>o.onSelect?.()} disabled={o.disabled}
            className={`text-xs px-3 py-1.5 rounded-lg border ${o.disabled?'border-zinc-700 text-zinc-500':'border-zinc-600 hover:border-emerald-500'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
