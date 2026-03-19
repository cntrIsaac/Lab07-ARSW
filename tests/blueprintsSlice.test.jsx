import { describe, it, expect } from 'vitest'
import reducer, {
  createBlueprint,
  fetchByAuthor,
  selectTopFiveBlueprintsByPoints,
} from '../src/features/blueprints/blueprintsSlice.js'

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.authors).toEqual([])
    expect(state.status.authors).toBe('idle')
  })

  it('stores blueprints by author when fetchByAuthor is fulfilled', () => {
    const payload = {
      author: 'john',
      items: [{ author: 'john', name: 'house', points: [{ x: 1, y: 2 }] }],
    }
    const state = reducer(undefined, fetchByAuthor.fulfilled(payload, 'req-1', 'john'))
    expect(state.byAuthor.john).toHaveLength(1)
    expect(state.status.byAuthor).toBe('succeeded')
  })

  it('adds author if createBlueprint succeeds', () => {
    const created = { author: 'ana', name: 'new-plan', points: [{ x: 0, y: 0 }] }
    const state = reducer(undefined, createBlueprint.fulfilled(created, 'req-2', created))
    expect(state.authors).toContain('ana')
    expect(state.byAuthor.ana[0].name).toBe('new-plan')
  })

  it('selects top five blueprints by points', () => {
    const mockState = {
      blueprints: {
        byAuthor: {
          john: [
            { author: 'john', name: 'A', points: [{}, {}, {}] },
            { author: 'john', name: 'B', points: [{}] },
          ],
          jane: [
            { author: 'jane', name: 'C', points: [{}, {}, {}, {}] },
            { author: 'jane', name: 'D', points: [{}, {}] },
            { author: 'jane', name: 'E', points: [{}, {}, {}, {}, {}] },
            { author: 'jane', name: 'F', points: [{}, {}, {}, {}, {}, {}] },
          ],
        },
      },
    }
    const top = selectTopFiveBlueprintsByPoints(mockState)
    expect(top).toHaveLength(5)
    expect(top[0].name).toBe('F')
  })
})
