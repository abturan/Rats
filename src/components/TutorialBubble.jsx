import React from 'react'
import ActionButton from './ui/ActionButton.jsx'

export default function TutorialBubble({ msg, stepIndex, total, onDo, onNext, onSkip }) {
  return (
    <div className="fixed left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-xl z-50">
      <div className="bg-zinc-950/95 border border-emerald-600/40 rounded-2xl p-4 shadow-2xl">
        <div className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Eğitim • Serseri Rehber</div>
        <div className="text-sm leading-relaxed">{msg}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton onClick={onDo}>Benim için tıkla</ActionButton>
          <ActionButton onClick={onNext}>→ Devam</ActionButton>
          <ActionButton onClick={onSkip}>Atla</ActionButton>
        </div>
        <div className="mt-2 text-[10px] text-zinc-500">Adım {stepIndex+1}/{total}</div>
      </div>
    </div>
  )
}
