// src/components/MagicCard.jsx
import React from 'react'

export default function MagicCard({ variant='item', title, subtitle, text, footer, onClick, children }) {
  const tone =
    variant==='location' ? 'from-sky-900/60 via-cyan-900/40 to-slate-900/40'
    : variant==='objective' ? 'from-amber-900/60 via-amber-800/30 to-zinc-900/40'
    : 'from-emerald-900/60 via-emerald-800/30 to-zinc-900/40'

  return (
    <div onClick={onClick}
      className={`rounded-2xl overflow-hidden border border-zinc-700 bg-gradient-to-br ${tone} hover:border-emerald-600 transition cursor-pointer`}>
      {/* başlık */}
      <div className="px-4 py-2 font-semibold text-zinc-100 bg-zinc-950/50 border-b border-zinc-700">{title}</div>
      {/* tip satırı */}
      {subtitle && <div className="px-4 py-1 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">{subtitle}</div>}
      {/* görsel alanı */}
      <div className="h-28 bg-zinc-900/60 flex items-center justify-center border-b border-zinc-800">
        <div className="placeholder w-[90%] h-[70%] flex items-center justify-center">Görsel</div>
      </div>
      {/* metin kutusu */}
      <div className="px-4 py-3 text-sm text-zinc-200 min-h-[64px]">
        {text || children}
      </div>
      {/* footer */}
      {footer && <div className="px-4 py-2 text-[11px] text-zinc-400 border-t border-zinc-800">{footer}</div>}
    </div>
  )
}
