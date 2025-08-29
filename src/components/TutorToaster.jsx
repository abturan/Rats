import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
export function useTutorToasts(){
  const show = React.useCallback((msg)=>{
    toast.custom((t)=>(
      <div className={`pointer-events-auto ${t.visible ? 'animate-in fade-in' : 'animate-out fade-out'} `}>
        <div className="max-w-md bg-zinc-950 border border-emerald-500/40 rounded-xl p-3 text-sm shadow-xl">
          <div className="text-emerald-400 text-xs mb-1 uppercase tracking-widest">Eğitim</div>
          <div className="text-zinc-200">{msg}</div>
        </div>
      </div>
    ), { duration: 3500 })
  },[])
  return { show }
}
export default function TutorToaster(){ return <Toaster position="bottom-center" /> }
