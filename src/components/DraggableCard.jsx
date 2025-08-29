// src/components/DraggableCard.jsx
import React from 'react'
import Draggable from 'react-draggable'
import { motion } from 'framer-motion'

// Yüzer kart — güvenilir sürükleme:
// - defaultPosition: kontrolsüz mod (sorunsuz drag)
// - bounds="parent": viewport konteynerinin dışına taşımaz
// - handle=".drag-handle": başlık çubuğundan sürüklenir (net davranış)
// - cancel="button, ...": buton/inputs tıklaması drag'i bozmaz
export default function DraggableCard({ id, children, title, right, onAnyDrag, defaultPos }) {
  const storageKey = `pos:${id}`
  const [initialPos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || defaultPos || { x: 24, y: 120 } }
    catch { return defaultPos || { x: 24, y: 120 } }
  })

  const nodeRef = React.useRef(null)

  const handleStop = (_e, data) => {
    const p = { x: data.x, y: data.y }
    try { localStorage.setItem(storageKey, JSON.stringify(p)) } catch {}
    onAnyDrag && onAnyDrag(id, p)
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={initialPos}
      bounds="parent"
      onStop={handleStop}
      handle=".drag-handle"
      cancel="button, a, input, textarea, select, [data-cancel-drag]"
    >
      <motion.div
        ref={nodeRef}
        className="absolute select-none z-30"
        initial={{ scale: .98, opacity: .95 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="w-[min(92vw,480px)] bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl shadow-2xl toxic-border">
          <div className="drag-handle cursor-move px-4 py-2 flex items-center justify-between border-b border-zinc-800">
            <div className="text-zinc-200 font-semibold">{title}</div>
            <div className="text-xs text-zinc-500">{right}</div>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </motion.div>
    </Draggable>
  )
}

export function resetAllPositions() {
  Object.keys(localStorage).forEach(k => { if (k.startsWith('pos:')) localStorage.removeItem(k) })
}
