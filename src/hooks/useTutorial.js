import React from 'react'

export default function useTutorial(api) {
  const blueprint = React.useMemo(()=>['start','hud','move','collect','endturn','go-reactor','interact-one','interact-two','win'],[])
  const [tutorialOn, setTutorialOn] = React.useState(false)
  const [tIdx, setTIdx] = React.useState(0)

  const tAdvance = React.useCallback(() => setTIdx(i => Math.min(i+1, blueprint.length-1)), [blueprint])
  const tSkip = React.useCallback(() => { setTutorialOn(false); setTIdx(0) }, [])

  // Auto-advance watchers
  const prevAtRef = React.useRef(null)
  const prevTurnRef = React.useRef(api.turn)
  React.useEffect(()=>{ prevAtRef.current = api.at },[api.at])
  React.useEffect(()=>{ prevTurnRef.current = api.turn },[api.turn])

  React.useEffect(()=>{
    if (!tutorialOn) return
    const id = blueprint[tIdx]
    if (id==='start' && api.started) setTIdx(1)
    if (id==='move' && prevAtRef.current!==null && api.at!==prevAtRef.current) setTIdx(i=>i+1)
    if (id==='collect'){ const f=api.kcc.feeding; const sum=f.bio+f.tech+f.chem+f.occult; if(sum>0) setTIdx(i=>i+1) }
    if (id==='endturn' && api.turn > prevTurnRef.current) setTIdx(i=>i+1)
    if (id==='go-reactor' && api.here?.id==='reactor') setTIdx(i=>i+1)
    if (id==='interact-one' && api.objective.progress>=1) setTIdx(i=>i+1)
    if (id==='interact-two' && api.victory) setTIdx(i=>i+1)
  },[tutorialOn, tIdx, api.started, api.at, api.kcc, api.turn, api.here, api.objective.progress, api.victory])

  const tId = tutorialOn ? blueprint[tIdx] : null

  const tMsg = React.useMemo(()=>{
    const reactorName = 'Sızdıran Reaktör Koridoru'
    switch(tId){
      case 'start': return 'Başlat düğmesine bas, motoru öttürelim. Korkma, patlayacak olan reaktör; sen değil.'
      case 'hud': return 'Şu tepedeki sayı var ya… AP. Benzinin. HP de teneke canın. Bitti mi? Topla kemiklerini.'
      case 'move': return "Hareket'e vur. Ayaklarını sürü, ortamı kokla. Rastgele de olur; mıntıka senin."
      case 'collect': return 'Şimdi bir çöp kap. Biyotekno kimyasal ne bulursan… Ama dikkat: KÇC bundan beslenir.'
      case 'endturn': return 'Turu bitir. KÇC sahneye çıkar, suratına üfler. Günün reality check’i.'
      case 'go-reactor': return `Konumlar'dan ${reactorName}’ne geç. Sızıntıyı gör, öksür, devam et.`
      case 'interact-one': return "Etkileşim'e bas. İlk cıvatayı sık. D20 döner, kader konuşur."
      case 'interact-two': return "Bir daha Etkileşim. Vanayı çevir, işi bitir. KÇC'ye ‘pışşt’ de."
      case 'win': return 'Bitti. Reaktör sustu. Sen de susma; tekrar dene, daha temiz dön.'
      default: return ''
    }
  },[tId])

  const highlight = React.useCallback((key) => tutorialOn && (
    (key==='start' && tId==='start') ||
    (key==='move' && tId==='move') ||
    (key==='collect' && tId==='collect') ||
    (key==='interact' && (tId==='interact-one' || tId==='interact-two')) ||
    (key==='end' && tId==='endturn') ||
    (key==='locations' && tId==='go-reactor') ||
    (key==='log' && tId==='endturn')
  ),[tutorialOn,tId])

  const tDoItForMe = React.useCallback(()=>{
    if (!tutorialOn) return
    switch(tId){
      case 'start': if (!api.started) api.startGame(); break;
      case 'move': api.moveTo(api.locations.find(l => l && l.id !== api.at)); break;
      case 'collect': api.collectTrash(); break;
      case 'endturn': api.endTurn(); break;
      case 'go-reactor': { const rx = api.locations.find(l => l.id==='reactor'); if (rx) api.moveTo(rx); break; }
      case 'interact-one':
      case 'interact-two': api.interact(); break;
      default: break;
    }
  },[tutorialOn, tId, api])

  return { blueprint, tutorialOn, setTutorialOn, tIdx, tAdvance, tSkip, tId, tMsg, highlight, tDoItForMe }
}
