import React from 'react'
import { rand, clone, roll, shuffle } from '../game/utils.js'
import { CHARACTERS, ITEM_DECK_BASE, LOCATION_POOL, REACTIONS } from '../game/constants.js'

export default function useGameCore() {
  // --- Game State ---
  const [started, setStarted] = React.useState(false)
  const [ap, setAp] = React.useState(2)
  const [turn, setTurn] = React.useState(1)
  const [character, setCharacter] = React.useState(null)
  const [hp, setHp] = React.useState(0)
  const [stress, setStress] = React.useState(0)
  const [handLimit, setHandLimit] = React.useState(5)
  const [buffs, setBuffs] = React.useState({ melee: 0, safeRest: false })

  const [itemDeck, setItemDeck] = React.useState([])
  const [hand, setHand] = React.useState([])

  const [locations, setLocations] = React.useState([])
  const [at, setAt] = React.useState(null)

  const [kcc, setKcc] = React.useState({ threat: 0, feeding: { bio: 0, tech: 0, chem: 0, occult: 0 }, evolutions: [], minions: 0 })
  const [objective, setObjective] = React.useState({ key: null, progress: 0, total: 0, title: '', dc: 12 })
  const [risky, setRisky] = React.useState(false)
  const [log, setLog] = React.useState([])
  const addLog = (s) => setLog((l) => [`${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} — ${s}`, ...l])

  // --- Derived ---
  const here = locations.find((l) => l.id === at)
  const gameOver = hp <= 0 || stress >= (character?.maxStress || 999)
  const victory = objective.progress >= objective.total && objective.total > 0

  // --- Start Game ---
  const startGame = () => {
    const c = CHARACTERS[rand(CHARACTERS.length)]
    const pool = shuffle(LOCATION_POOL).slice(0, 3 + rand(2))
    if (!pool.find((p) => p.id === 'reactor')) pool[0] = LOCATION_POOL.find((x) => x.id === 'reactor')

    const deck = shuffle(ITEM_DECK_BASE.concat(ITEM_DECK_BASE).concat(ITEM_DECK_BASE))
    const initHand = []
    let d = deck.slice()
    for (let i = 0; i < 3; i++) initHand.push(d.shift())

    setCharacter(c)
    setHp(c.maxHp)
    setStress(0)
    setHandLimit(5)
    setBuffs({ melee: c.tags.includes('brute') ? 1 : 0, safeRest: false })

    setItemDeck(d)
    setHand(initHand)

    setLocations(pool.map((p, i) => ({ ...clone(p), idx: i })))
    setAt(pool[0].id)

    const reactor = pool.find((p) => p.id === 'reactor')
    if (reactor && reactor.objective)
      setObjective({ key: reactor.objective.key, progress: 0, total: reactor.objective.steps, title: reactor.objective.title, dc: reactor.objective.dc })

    setKcc({ threat: 0, feeding: { bio: 0, tech: 0, chem: 0, occult: 0 }, evolutions: [], minions: 0 })

    setAp(2 + (c.id === 'rex' ? 1 : 0))
    setTurn(1)
    setRisky(false)
    setLog([])
    addLog(`Göreve başladın: ${c.name}.`)
    setStarted(true)
  }

  // --- Card Play Effects ---
  const drawItems = (n = 1) => {
    let d = itemDeck.slice()
    const drawn = []
    for (let i = 0; i < n && d.length > 0; i++) drawn.push(d.shift())
    setItemDeck(d)
    setHand((h) => [...h, ...drawn])
  }

  const useItem = (card) => {
    if (!card || ap <= 0) return
    const idx = hand.findIndex((c) => c === card)
    if (idx === -1) return
    let consumed = false
    let newCard = { ...card }

    switch (card.type) {
      case 'weapon':
        setBuffs((b) => ({ ...b, melee: b.melee + 2 }))
        addLog('Paslı Levye: Bu tur Yakın Dövüş +2.')
        break
      case 'heal':
        setHp((x) => Math.min(x + 2, character.maxHp))
        consumed = true
        addLog('İlk Yardım: +2 Can.')
        break
      case 'emp':
        setKcc((k) => ({ ...k, minions: Math.max(0, k.minions - 1), feeding: { ...k.feeding, tech: Math.max(0, k.feeding.tech - 1) } }))
        consumed = true
        addLog('EMP Bombası: Minyon -1, Teknolojik beslenme -1.')
        break
      case 'tool':
        setBuffs((b) => ({ ...b, eng: (b.eng || 0) + 3 }))
        newCard.uses = (newCard.uses || 0) - 1
        addLog('İmprovize Tamir Kiti: Mühendislik +3.')
        if (newCard.uses <= 0) consumed = true
        break
      case 'chaos': {
        const good = Math.random() < 0.5
        if (good) {
          setKcc((k) => ({ ...k, minions: Math.max(0, k.minions - 2) }))
          addLog('Gizemli Düğme: Şanslısın! Minyonlar -2.')
        } else {
          setHp((x) => x - 2)
          setStress((s) => s + 1)
          addLog('Gizemli Düğme: Geri tepti! -2 Can, +1 Stres.')
        }
        consumed = true
        break
      }
      case 'utility':
        setBuffs((b) => ({ ...b, safeRest: true }))
        consumed = true
        addLog('Acil Feneri: Bu tur gafil avlanma yok.')
        break
      default:
        break
    }

    setAp((x) => x - 1)
    const newHand = hand.slice()
    if (consumed) newHand.splice(idx, 1)
    else newHand[idx] = newCard
    setHand(newHand)
  }

  // --- Actions ---
  const moveTo = (loc) => {
    if (ap <= 0 || !started || gameOver || victory) return
    if (!loc || loc.id === at) return
    setAt(loc.id)
    setAp((x) => x - 1)
    addLog(`"${loc.name}" konumuna hareket ettin.`)
    if (loc.id === 'mushroom' && Math.random() < 0.4) {
      setStress((s) => s + 1)
      addLog('Sporlar sinir sistemini gıdıkladı: +1 Stres.')
    }
  }

  const collectTrash = () => {
    if (ap <= 0 || !here) return
    const types = ['bio', 'tech', 'chem', 'occult'].filter((t) => here.trash[t] > 0)
    if (!types.length) {
      addLog('Toplanacak çöp kalmadı.')
      return
    }
    const type = types[rand(types.length)]
    const newLocs = locations.map((l) => (l.id === here.id ? { ...l, trash: { ...l.trash, [type]: l.trash[type] - 1 } } : l))
    setLocations(newLocs)
    setKcc((k) => ({ ...k, feeding: { ...k.feeding, [type]: k.feeding[type] + 1 } }))
    setRisky(true)
    setAp((x) => x - 1)

    const label = { bio: 'Biyolojik', tech: 'Teknolojik', chem: 'Kimyasal', occult: 'Ezoterik' }[type]
    addLog(`Bir ${label} Çöp Jetonu topladın → KÇC beslendi.`)
  }

  const attack = () => {
    if (ap <= 0) return
    const meleeBonus = buffs.melee || 0
    const rollVal = roll(20) + meleeBonus
    let out = `Saldırı atışı: d20+${meleeBonus} = ${rollVal}. `
    if (kcc.minions > 0) {
      if (rollVal >= 10) {
        setKcc((k) => ({ ...k, minions: Math.max(0, k.minions - 1) }))
        out += 'Bir minyonu dağıttın.'
      } else {
        out += 'Iskaladın.'
      }
    } else {
      if (rollVal >= 12) {
        setKcc((k) => ({ ...k, threat: Math.max(0, k.threat - 1) }))
        out += 'KÇC’yi sendeledin: Tehdit -1.'
      } else {
        out += 'KÇC’nin zırhı darbeyi emdi.'
      }
    }
    setAp((x) => x - 1)
    setBuffs((b) => ({ ...b, melee: character?.tags.includes('brute') ? 1 : 0 }))
    addLog(out)
  }

  const interact = () => {
    if (ap <= 0) return
    if (!here?.objective || objective.key !== here.objective?.key) {
      addLog('Burada etkileşecek bir hedef yok.')
      return
    }
    const engBonus = (buffs.eng || 0) + (character?.tags.includes('engineer') ? 2 : 0)
    if (character?.id === 'kev' && Math.random() < 0.15) {
      setHp((x) => x - 1)
      addLog('Kev’in tamiri patladı: -1 Can.')
    }
    const r = roll(20) + engBonus
    const ok = r >= objective.dc
    addLog(`Mühendislik kontrolü (d20+${engBonus}) = ${r} → ${ok ? 'BAŞARI' : 'BAŞARISIZLIK'}.`)
    if (ok) setObjective((o) => ({ ...o, progress: o.progress + 1 }))
    else {
      setStress((s) => s + 1)
      addLog('Başarısızlık: +1 Stres.')
    }
    setAp((x) => x - 1)
  }

  const rest = () => {
    if (ap <= 0) return
    setStress((s) => Math.max(0, s - 1))
    addLog('Dinlen: -1 Stres.')
    if (!buffs.safeRest) {
      setRisky(true)
      addLog('Savunmasız dinlenme: Bu tur KÇC fazında ekstra tepki olabilir.')
    } else {
      setBuffs((b) => ({ ...b, safeRest: false }))
      addLog('Acil Feneri aktif: Güvenli dinlendin.')
    }
    setAp((x) => x - 1)
  }

  const resolveReaction = (r) => {
    switch (r.effect) {
      case 'hp-1':
        setHp((x) => x - 1)
        break
      case 'chem-hit':
        setHp((x) => x - 1)
        break
      case 'stress+1':
        setStress((s) => s + 1)
        break
      case 'emp-burst':
        if (ap > 0) setAp((x) => Math.max(0, x - 1))
        break
      case 'spawn':
        setKcc((k) => ({ ...k, minions: k.minions + 1 }))
        break
      default:
        break
    }
    setKcc((k) => {
      let hpDelta = 0,
        stressDelta = 0
      if (k.evolutions.includes('Radyasyon Aurası') && r.effect === 'chem-hit') hpDelta -= 1
      if (k.evolutions.includes('Zihin Bükümü') && r.effect === 'stress+1') stressDelta += 1
      if (hpDelta) setHp((x) => x + hpDelta)
      if (stressDelta) setStress((s) => s + stressDelta)
      return k
    })
  }

  const endTurn = () => {
    if (!started || gameOver || victory) return
    setKcc((k) => ({ ...k, threat: Math.min(10, k.threat + 1) }))
    setKcc((k) => {
      const evo = []
      const f = { ...k.feeding }
      const push = (name) => {
        if (!k.evolutions.includes(name)) evo.push(name)
      }
      while (f.bio >= 3) {
        f.bio -= 3
        push('Organik Rejenerasyon')
      }
      while (f.tech >= 3) {
        f.tech -= 3
        push('Zırh Plakaları')
      }
      while (f.chem >= 3) {
        f.chem -= 3
        push('Radyasyon Aurası')
      }
      while (f.occult >= 3) {
        f.occult -= 3
        push('Zihin Bükümü')
      }
      if (evo.length) addLog(`KÇC evrimleşti: ${evo.join(', ')}.`)
      return { ...k, feeding: f, evolutions: [...k.evolutions, ...evo] }
    })

    const draws = 1 + (risky ? 1 : 0)
    for (let i = 0; i < draws; i++) {
      const r = REACTIONS[rand(REACTIONS.length)]
      resolveReaction(r)
      addLog(`KÇC Tepki: ${r.name} — ${r.text}`)
    }

    setRisky(false)
    setAp(2)
    setTimeout(() => {
      if (hand.length < handLimit) drawItems(1)
    }, 0)
    setTurn((t) => t + 1)
  }

  // Trauma check
  React.useEffect(() => {
    if (!character) return
    if (stress >= character.maxStress) {
      addLog('Travma eşiği aşıldı! Kalıcı Etki: El limiti -1, Stres −2.')
      setHandLimit((h) => Math.max(3, h - 1))
      setStress((s) => Math.max(0, s - 2))
    }
  }, [stress])

  return {
    // state
    started, ap, turn, character, hp, stress, handLimit, buffs,
    itemDeck, hand, locations, at, kcc, objective, risky, log,
    // derived
    here, gameOver, victory,
    // actions
    startGame, drawItems, useItem, moveTo, collectTrash, attack, interact, rest, endTurn, addLog,
  }
}
