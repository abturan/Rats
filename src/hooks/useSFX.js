import { useRef, useCallback } from 'react'
export default function useSFX(){
  const ctxRef = useRef(null)
  const getCtx = () => (ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)())

  const beep = useCallback((freq=440, dur=0.07, type='square')=>{
    const ctx = getCtx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur)
  },[])

  const click = useCallback(()=>beep(220, 0.03, 'sine'),[beep])
  const ok = useCallback(()=>{ beep(880,0.05,'square'); setTimeout(()=>beep(1320,0.05,'square'),60)},[beep])
  const err = useCallback(()=>{ beep(150,0.08,'sawtooth') },[beep])

  return { beep, click, ok, err }
}
