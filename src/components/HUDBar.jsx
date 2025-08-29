// src/components/HUDBar.jsx
import React from 'react'

function Pill({ label, value, icon, tone='zinc', pulse }) {
  const pulseCls = pulse === 'up' ? 'hud-pulse-green' : pulse === 'down' ? 'hud-pulse-red' : ''
  return (
    <div className={`hud-pill ${pulseCls}`}>
      <span className="opacity-70 mr-2">{icon}</span>
      <span className="font-semibold">{label}</span>
      <span className="mx-2 opacity-50">•</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

// basit önceki-değeri-karşılaştır kancası
function useDelta(val){
  const ref = React.useRef(val)
  const [dir, setDir] = React.useState(null) // 'up' | 'down' | null
  React.useEffect(()=> {
    if (val > ref.current) setDir('up')
    else if (val < ref.current) setDir('down')
    else setDir(null)
    ref.current = val
    const t = setTimeout(()=>setDir(null), 600)
    return ()=>clearTimeout(t)
  }, [val])
  return dir
}

export default function HUDBar({ hp, stress, ap, turn }) {
  const dHp = useDelta(hp)
  const dStr = useDelta(stress)
  const dAp = useDelta(ap)

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] flex gap-3 items-center">
      <Pill label="HP" value={hp} icon="❤️" pulse={dHp}/>
      <Pill label="Akıl" value={Math.max(0, 10 - stress)} icon="🧠" pulse={dStr ? (dStr==='down' ? 'up' : 'down') : null}/>
      <Pill label="AP" value={ap} icon="⛽" pulse={dAp}/>
      <Pill label="Tur" value={turn} icon="⏱️" />
    </div>
  )
}
