// src/App.jsx
import React from 'react'
import useGameCore from './hooks/useGameCore.js'
import useSelfTests from './hooks/useSelfTests.js'
import useTutorial from './hooks/useTutorial.js'
import useSFX from './hooks/useSFX.js'
import StatPill from './components/ui/StatPill.jsx'
import Badge from './components/ui/Badge.jsx'
import Section from './components/ui/Section.jsx'
import ActionButton from './components/ui/ActionButton.jsx'
import TutorialBubble from './components/TutorialBubble.jsx'
import GenerativeBackground from './components/GenerativeBackground.jsx'
import FocusHighlighter from './components/FocusHighlighter.jsx'
import ModalIntro from './components/ModalIntro.jsx'
import TutorToaster, { useTutorToasts } from './components/TutorToaster.jsx'
import TerminalLog from './components/TerminalLog.jsx'
import MonsterMeters from './components/MonsterMeters.jsx'
import DraggableCard, { resetAllPositions } from './components/DraggableCard.jsx'

export default function App() {
  const game = useGameCore()
  const { testResults, runSelfTests, setTestResults } = useSelfTests()
  const tutorial = useTutorial({ ...game })
  const sfx = useSFX()
  const tutorToast = useTutorToasts()

  const {
    started, ap, turn, character, handLimit, buffs, hand,
    locations, at, kcc, objective, risky, log, here, gameOver, victory
  } = game
  const { startGame, drawItems, useItem, moveTo, collectTrash, attack, interact, rest, endTurn } = game
  const { tutorialOn, setTutorialOn, tIdx, tAdvance, tSkip, tId, tMsg, highlight, blueprint, tDoItForMe } = tutorial

  const [introOpen, setIntroOpen] = React.useState(true)

  React.useEffect(() => { if (tutorialOn) { tutorToast.show(tMsg); sfx.click() } }, [tutorialOn, tId, tMsg])

  // Varsayılan yerleşim: HER ŞEY GÖRÜNÜR OLSUN diye TEK SÜTUN (x=24), dikey istif.
  // Kullanıcı sonra sürükleyip dağıtabilir. (Pozisyonlar localStorage’a yazılıyor.)
  const defaults = {
    character: { x: 24, y: 120 },
    actions:   { x: 24, y: 320 },
    hand:      { x: 24, y: 520 },
    locations: { x: 24, y: 740 },
    log:       { x: 24, y: 980 },
    kcc:       { x: 24, y: 1200 },
    objective: { x: 24, y: 1420 },
    end:       { x: 24, y: 1580 },
    tests:     { x: 24, y: 1760 },
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-100 overflow-auto">
      <GenerativeBackground />

      {/* Üst bar */}
      <div className="fixed top-3 left-3 right-3 z-40 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight glitch relative" data-text="YILDIZLARARASI LAĞIM FARELERİ">YILDIZLARARASI LAĞIM FARELERİ</h1>
            <div className="text-[11px] text-zinc-500 -mt-1">Elastic • Toxic • VHS</div>
          </div>
          <ActionButton onClick={() => { setTutorialOn(true); sfx.ok() }} disabled={false} highlight={tutorialOn && tId === 'hud'}>Eğitim</ActionButton>
          <ActionButton onClick={() => setIntroOpen(true)}>Sunum</ActionButton>
          <ActionButton onClick={() => { resetAllPositions(); window.location.reload() }}>Konumları Resetle</ActionButton>
        </div>
        <div className="flex gap-2 items-center">
          <StatPill label="Tur" value={turn} />
          {started && <StatPill label="AP" value={ap} />}
        </div>
      </div>

      {/* Başlangıç ekranı */}
      {!started && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24 z-10">
          <Section title="Hazırsan Başlayalım" right={null}>
            <p className="text-sm text-zinc-300 mb-3">Tek kişilik MVP. Kart çek, konumlara ak, çöpleri topla (KÇC’yi BESLER!), hedefi tamamla ve mümkünse ölme.</p>
            <button
              data-tour="start"
              onClick={() => { startGame(); sfx.ok() }}
              className={`px-4 py-2 rounded-xl font-medium ${highlight('start') ? 'bg-emerald-600 ring-2 ring-emerald-400 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              Oyunu Başlat
            </button>
            <p className="text-xs text-zinc-400 mt-3">Not: Bu demo; daha fazla kart, konum, evrim ve çok oyunculu için genişletilebilir.</p>
          </Section>
        </div>
      )}

      {/* Yüzer paneller — TEK SÜTUN default; drag ile istediğin gibi dağıt */}
      {started && (
        <>
          <DraggableCard id="character" title="Karakter" defaultPos={defaults.character}>
            <div className="text-sm">
              <div className="font-semibold">{character.name}</div>
              <div className="text-zinc-400">{character.passive}</div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-zinc-400 mb-1">Bufflar:</div>
              <div className="flex flex-wrap gap-2">
                <Badge color="border-zinc-700">Yakın Dövüş +{buffs.melee || 0}</Badge>
                <Badge color="border-zinc-700">Mühendislik +{buffs.eng || 0}</Badge>
                {buffs.safeRest && <Badge color="border-emerald-600/50">Güvenli Dinlen</Badge>}
              </div>
            </div>
          </DraggableCard>

          <DraggableCard id="actions" title="Eylemler" defaultPos={defaults.actions}>
            <div className="flex flex-wrap">
              <ActionButton onClick={() => { moveTo(locations.find(l => l && l.id !== at)); sfx.click() }} disabled={ap <= 0} highlight={highlight('move')}>Rastgele Hareket</ActionButton>
              <ActionButton onClick={() => { collectTrash(); sfx.click() }} disabled={ap <= 0} highlight={highlight('collect')}>Çöp Topla</ActionButton>
              <ActionButton onClick={() => { interact(); sfx.click() }} disabled={ap <= 0} highlight={highlight('interact')}>Etkileşim</ActionButton>
              <ActionButton onClick={() => { attack(); sfx.click() }} disabled={ap <= 0}>Saldır</ActionButton>
              <ActionButton onClick={() => { rest(); sfx.click() }} disabled={ap <= 0}>Dinlen</ActionButton>
              <ActionButton onClick={() => { endTurn(); sfx.click() }} disabled={false} highlight={highlight('end')}>Turu Bitir</ActionButton>
            </div>
          </DraggableCard>

          <DraggableCard id="hand" title={`Elin (${hand.length}/${handLimit})`} defaultPos={defaults.hand}>
            <div className="grid grid-cols-2 gap-2">
              {hand.map((c, i) => (
                <button key={i} onClick={() => { useItem(c); sfx.click() }} className="text-left bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 hover:border-zinc-600">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-zinc-400">{c.text}</div>
                  {typeof c.uses === 'number' && <div className="mt-1 text-[10px] text-zinc-500">Kullanım: {Math.max(0, c.uses)}</div>}
                </button>
              ))}
            </div>
            {hand.length < handLimit && (
              <button onClick={() => { drawItems(1); sfx.click() }} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-900">Kart Çek</button>
            )}
          </DraggableCard>

          <DraggableCard id="locations" title="Konumlar" defaultPos={defaults.locations} right={`Şu an: ${here?.name || '-'}`}>
            <div className="grid sm:grid-cols-2 gap-3">
              {locations.map(l => (
                <button
                  key={l.id}
                  data-tour={l.id === 'reactor' ? 'reactor' : undefined}
                  onClick={() => { moveTo(l); sfx.click() }}
                  className={`text-left rounded-2xl p-4 border transition ${
                    l.id === at
                      ? 'border-emerald-600 bg-emerald-950/20'
                      : (highlight('locations') && l.id === 'reactor')
                        ? 'border-emerald-500 ring-2 ring-emerald-500 animate-pulse bg-zinc-950/50'
                        : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950/50'
                  }`}
                >
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-zinc-400 mb-2">{l.note || ''}</div>
                  <div className="flex gap-2 text-xs flex-wrap">
                    <Badge color="border-green-600/40">🧫 {l.trash.bio}</Badge>
                    <Badge color="border-blue-600/40">🤖 {l.trash.tech}</Badge>
                    <Badge color="border-yellow-600/40">☣️ {l.trash.chem}</Badge>
                    <Badge color="border-purple-600/40">🔮 {l.trash.occult}</Badge>
                  </div>
                  {l.objective && (<div className="mt-2 text-xs">🎯 <b>{l.objective.title}</b> — DC {l.objective.dc}</div>)}
                </button>
              ))}
            </div>
          </DraggableCard>

          <DraggableCard id="log" title="Günlük / Terminal" defaultPos={defaults.log}>
            <TerminalLog lines={log} />
          </DraggableCard>

          <DraggableCard id="kcc" title="Kozmik Çöp Canavarı (KÇC)" defaultPos={defaults.kcc}>
            <MonsterMeters kcc={kcc} />
          </DraggableCard>

          <DraggableCard id="objective" title="Görev Durumu" defaultPos={defaults.objective}>
            {objective.total > 0 ? (
              <div className="text-sm">
                <div className="font-medium">{objective.title}</div>
                <div className="mt-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${(objective.progress / objective.total) * 100}%` }} />
                </div>
                <div className="text-xs text-zinc-400 mt-1">İlerleme: {objective.progress}/{objective.total}</div>
              </div>
            ) : (<div className="text-sm text-zinc-400">Aktif görev yok.</div>)}
          </DraggableCard>

          <DraggableCard id="end" title="Tur Sonu" defaultPos={defaults.end}>
            <ActionButton onClick={() => { endTurn(); sfx.click() }} highlight={highlight('end')}>KÇC Fazına Geç</ActionButton>
            <div className="text-xs text-zinc-500 mt-2">Tur sonunda: Tehdit +1, Evrimler tetiklenir (3 aynı çöp), 1 ({risky ? '+1 risk' : '+0'}) tepki çözülür.</div>
          </DraggableCard>

          <DraggableCard id="tests" title="Kendini Test Et (MVP)" defaultPos={defaults.tests}>
            <div className="text-xs">
              {testResults.length === 0 ? (
                <div className="text-zinc-500">Henüz test yok…</div>
              ) : (
                <ul className="space-y-1">
                  {testResults.map((r, i) => (
                    <li key={i} className={r.ok ? 'text-emerald-400' : 'text-red-400'}>
                      {r.ok ? '✓' : '✗'} {r.name}{!r.ok && r.err ? ` — ${r.err}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-2"><ActionButton onClick={() => setTestResults(runSelfTests())}>Yeniden Çalıştır</ActionButton></div>
          </DraggableCard>
        </>
      )}

      {/* Yenilgi/Kazan modalı — SADECE oyun başladıysa */}
      {started && (victory || gameOver) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full text-center">
            <div className="text-3xl mb-2 font-black tracking-tight">{victory ? 'GÖREV BAŞARILI' : 'BERTARAF EDİLDİN'}</div>
            <div className="text-zinc-400 mb-4">{victory ? 'Reaktörü yamaladın, istasyon (şimdilik) güvende.' : 'KÇC seni sindirdi. Bir dahaki sefere daha az çöp besle.'}</div>
            <button onClick={startGame} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium">
              {victory ? 'Yeniden Çalıştır' : 'Tekrar Dene'}
            </button>
          </div>
        </div>
      )}

      {/* Tutorial & yardımcılar */}
      {tutorialOn && (
        <TutorialBubble msg={tMsg} stepIndex={tIdx} total={blueprint.length} onDo={tDoItForMe} onNext={tAdvance} onSkip={tSkip} />
      )}
      <FocusHighlighter selector={tId === 'start' ? '[data-tour=start]' : (tId === 'go-reactor' ? '[data-tour=reactor]' : null)} active={tutorialOn} />
      <ModalIntro open={introOpen} onClose={() => setIntroOpen(false)} />
      <TutorToaster />

      {/* Scroll alanı: paneller tek sütunda rahatça sığsın */}
      <div className="h-[2100px]" />
    </div>
  )
}
