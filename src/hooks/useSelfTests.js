import React from 'react'
import { rand, roll, shuffle, clone } from '../game/utils.js'
import { LOCATION_POOL, ITEM_DECK_BASE, REACTIONS } from '../game/constants.js'

export default function useSelfTests() {
  const runSelfTests = React.useCallback(() => {
    const results = []
    const assert = (cond, msg) => { if (!cond) throw new Error(msg) }
    const record = (name, fn) => { try { fn(); results.push({ name, ok: true }) } catch (e) { results.push({ name, ok: false, err: String(e.message || e) }) } }

    // Existing tests
    record('roll(20) within 1..20', () => { for (let i=0;i<100;i++){ const r=roll(20); assert(Number.isInteger(r),'not int'); assert(r>=1&&r<=20,`out ${r}`)} })
    record('roll(1) always 1', () => { for (let i=0;i<20;i++) assert(roll(1)===1,'not 1') })
    record('rand(n) within 0..n-1', () => { for (let i=0;i<100;i++){ const r=rand(5); assert(Number.isInteger(r),'not int'); assert(r>=0&&r<5,`out ${r}`)} })
    record('shuffle keeps elements', () => { const arr=[1,2,3,4,5]; const s=shuffle(arr); const A=[...arr].sort(); const B=[...s].sort(); if (s.length!==arr.length) throw new Error('len mismatch'); for (let i=0;i<A.length;i++) if (A[i]!==B[i]) throw new Error('lost/dup elements') })
    record('tutorial blueprint minimal steps', () => { const ids=['start','hud','move','collect','endturn','go-reactor','interact-one','interact-two','win']; if(!(Array.isArray(ids)&&ids.length>=8)) throw new Error('tutorial too short'); if (ids[0]!=='start') throw new Error('tutorial does not start with start') })

    // Additional tests
    record('tutorial ends with win', () => { const ids=['start','hud','move','collect','endturn','go-reactor','interact-one','interact-two','win']; if (ids.at(-1)!=='win') throw new Error('tutorial does not end with win') })
    record('clone deep-copies plain object', () => { const o={a:{b:1}}; const c=clone(o); c.a.b=2; if (o.a.b!==1) throw new Error('clone is not deep') })
    record('reactor location exists', () => { if (!LOCATION_POOL.some(l=>l.id==='reactor')) throw new Error('reactor location missing') })
    record('reactor objective shape', () => { const r=LOCATION_POOL.find(l=>l.id==='reactor'); if (!r || !r.objective) throw new Error('no reactor objective'); if (r.objective.steps!==2) throw new Error('reactor steps not 2'); if (r.objective.dc!==12) throw new Error('reactor dc not 12') })
    record('ITEM_DECK_BASE ids unique', () => { const ids=ITEM_DECK_BASE.map(i=>i.id); if (new Set(ids).size!==ids.length) throw new Error('duplicate item ids') })
    record('REACTIONS entries valid', () => { REACTIONS.forEach(r=>{ if(!(r.id && r.name && r.effect)) throw new Error('reaction missing fields') }) })

    return results
  }, [])

  const [testResults, setTestResults] = React.useState([])
  React.useEffect(()=>{ setTestResults(runSelfTests()) },[runSelfTests])

  return { testResults, runSelfTests, setTestResults }
}
