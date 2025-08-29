import React from 'react'

export default function GenerativeBackground(){
  const ref = React.useRef(null)
  React.useEffect(()=>{
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, rid
    const DPR = window.devicePixelRatio || 1
    const nodes = Array.from({length: 60}, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random()-.5)*0.0008, vy: (Math.random()-.5)*0.0008 }))

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * DPR; canvas.height = h * DPR
      ctx.scale(DPR, DPR)
    }
    const draw = () => {
      ctx.clearRect(0,0,w,h)
      // faint noise
      ctx.fillStyle = 'rgba(20,255,100,0.02)'
      ctx.fillRect(0,0,w,h)
      // connections
      for (let i=0;i<nodes.length;i++){
        const a = nodes[i]
        a.x += a.vx; a.y += a.vy
        if (a.x<0||a.x>1) a.vx*=-1
        if (a.y<0||a.y>1) a.vy*=-1
        for (let j=i+1;j<nodes.length;j++){
          const b = nodes[j]
          const dx = (a.x - b.x), dy = (a.y - b.y)
          const d2 = dx*dx + dy*dy
          if (d2 < 0.04){
            const alpha = 0.15 * (1 - d2/0.04)
            ctx.strokeStyle = `rgba(57,255,20,${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h); ctx.stroke()
          }
        }
        ctx.fillStyle = 'rgba(57,255,20,0.6)'
        ctx.beginPath(); ctx.arc(a.x*w, a.y*h, 1.3, 0, Math.PI*2); ctx.fill()
      }
      rid = requestAnimationFrame(draw)
    }
    const onResize = () => { resize(); }
    resize(); draw()
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(rid); window.removeEventListener('resize', onResize) }
  },[])
  return <canvas ref={ref} className="absolute inset-0 -z-10 opacity-60" />
}
