import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionButton from './ui/ActionButton.jsx'

const PAGES = [
  { key:'story', title:'Hikaye', content:(
    <div className="space-y-3">
      <p>Evrenin lağım boruları tıkandı. İstasyonlar <b>kozmik çöple</b> boğuşuyor. Biz de mıntıkacı ekibiz.</p>
      <div className="placeholder">Görsel yeri — <i>Hikaye illüstrasyonu</i></div>
    </div>
  )},
  { key:'goal', title:'Amaç', content:(
    <div className="space-y-3">
      <p>Reaktörü <b>2 adımda</b> onar, KÇC’yi oyalarken ekibi hayatta tut.</p>
      <ul className="list-disc pl-5 text-zinc-300"><li>Kazanç: Reaktör onarılır.</li><li>Kayıp: HP 0 ya da Stres dolarsa biter.</li></ul>
    </div>
  )},
  { key:'rules', title:'Kurallar', content:(
    <div className="space-y-3">
      <p>Her tur <b>2 AP</b>. Eylemler: <i>Hareket, Çöp Topla, Etkileşim, Saldır, Dinlen, Eşya Kullan</i>.</p>
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="placeholder">Görsel yeri — <i>Kart mockup</i></div>
        <div className="placeholder">Görsel yeri — <i>Konum planı</i></div>
      </div>
    </div>
  )},
  { key:'odds', title:'Olasılıklar', content:(
    <div className="space-y-3">
      <p>d20 tabanlı kontroller. Buff’lar + tehlike durumları etki eder.</p>
      <div className="placeholder">Grafik yeri — <i>Başarı yüzdesi eğrisi</i></div>
    </div>
  )},
  { key:'monster', title:'KÇC Süreci', content:(
    <div className="space-y-3">
      <p>KÇC <b>beslenir</b>, <b>evrimleşir</b>, <b>tepki verir</b>. Aşağı göstergeler yeşilden kırmızıya gider.</p>
      <div className="space-y-2">
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600"></div>
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600"></div>
        <div className="placeholder">Görsel yeri — <i>Evrim akış diyagramı</i></div>
      </div>
    </div>
  )},
  { key:'methods', title:'Yöntemler & Taktikler', content:(
    <div className="space-y-3">
      <ul className="list-disc pl-5">
        <li>Önce <b>çöp yönetimi</b>. Aynı türden 3 ⇢ evrim.</li>
        <li>Buff’ları kritik hamlelere sakla.</li>
        <li><b>Dinlen</b> riskliyse fazladan tepki doğar — <i>Acil Feneri</i> ile güvenli.</li>
      </ul>
      <div className="placeholder">Görsel yeri — <i>Taktik diyagramı</i></div>
    </div>
  )},
]

export default function ModalIntro({ open, onClose }){
  const [idx, setIdx] = React.useState(0)
  const page = PAGES[idx]
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 scanlines toxic-border"
            initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .9, opacity:0 }}>
            <div className="absolute right-4 top-4">
              <ActionButton onClick={onClose}>Kapat</ActionButton>
            </div>
            <h3 className="text-xl font-bold mb-2 glitch relative" data-text={page.title}>{page.title}</h3>
            <div className="text-sm text-zinc-300 space-y-3">{page.content}</div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{idx+1} / {PAGES.length}</span>
              <div>
                {idx>0 && <ActionButton onClick={()=>setIdx(i=>i-1)}>← Geri</ActionButton>}
                {idx<PAGES.length-1 ? <ActionButton onClick={()=>setIdx(i=>i+1)}>İleri →</ActionButton> : <ActionButton onClick={onClose}>Başla</ActionButton>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
