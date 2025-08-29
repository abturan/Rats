import { describe, it, expect } from 'vitest'
import { rand, roll, shuffle, clone } from '../game/utils.js'
import { LOCATION_POOL, ITEM_DECK_BASE, REACTIONS } from '../game/constants.js'

describe('utils', () => {
  it('roll(20) within 1..20', () => {
    for (let i = 0; i < 100; i++) {
      const r = roll(20)
      expect(Number.isInteger(r)).toBe(true)
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(20)
    }
  })

  it('roll(1) always 1', () => {
    for (let i = 0; i < 20; i++) expect(roll(1)).toBe(1)
  })

  it('rand(n) within 0..n-1', () => {
    for (let i = 0; i < 100; i++) {
      const r = rand(5)
      expect(Number.isInteger(r)).toBe(true)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(5)
    }
  })

  it('shuffle keeps elements', () => {
    const arr = [1,2,3,4,5]
    const s = shuffle(arr)
    const A = [...arr].sort()
    const B = [...s].sort()
    expect(s.length).toBe(arr.length)
    for (let i = 0; i < A.length; i++) expect(A[i]).toBe(B[i])
  })

  it('clone deep-copies plain object', () => {
    const o = { a: { b: 1 } }
    const c = clone(o)
    c.a.b = 2
    expect(o.a.b).toBe(1)
  })
})

describe('constants', () => {
  it('reactor location exists and has correct objective', () => {
    const r = LOCATION_POOL.find(l => l.id === 'reactor')
    expect(r).toBeTruthy()
    expect(r.objective.steps).toBe(2)
    expect(r.objective.dc).toBe(12)
  })

  it('item ids are unique', () => {
    const ids = ITEM_DECK_BASE.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reactions have required fields', () => {
    for (const r of REACTIONS) {
      expect(!!r.id && !!r.name && !!r.effect).toBe(true)
    }
  })
})
