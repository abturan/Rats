import React from 'react'
export default function FocusHighlighter({ selector, active }){
  const [rect, setRect] = React.useState(null)
  React.useEffect(()=>{
    if (!active || !selector) { setRect(null); return }
    const el = document.querySelector(selector)
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    setRect({ left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height })
  },[selector, active])
  if (!active || !rect) return null
  return (
    <div style={{ position:'absolute', left: rect.left-6, top: rect.top-6, width: rect.width+12, height: rect.height+12, pointerEvents:'none' }}
         className="z-40 rounded-2xl ring-2 ring-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] animate-pulse" />
  )
}
