import React from 'react'

export default function TerminalLog({ lines }){
  const ref = React.useRef(null)
  const [typed, setTyped] = React.useState('')

  React.useEffect(()=>{
    if(!lines || lines.length===0) return
    const latest = lines[0] // newest first per app
    setTyped('')
    let i=0
    const id = setInterval(()=>{
      i++
      setTyped(latest.slice(0,i))
      if (i>=latest.length){ clearInterval(id) }
      ref.current && (ref.current.scrollTop = ref.current.scrollHeight)
    }, 12)
    return ()=>clearInterval(id)
  },[lines])

  return (
    <div ref={ref} className="relative h-64 overflow-auto rounded-xl border border-zinc-800 bg-black crt text-emerald-400 p-3 font-mono text-[12px] leading-relaxed scanlines">
      {lines.slice().reverse().map((line, idx)=>(<div key={idx} className="opacity-80">{line}</div>))}
      <div className="mt-1 text-emerald-300">{typed}<span className="cursor">▌</span></div>
    </div>
  )
}
