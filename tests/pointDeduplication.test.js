import { describe, it, expect } from 'vitest'

describe('Point deduplication logic', () => {
  /**
   * Simula la lógica de deduplicación usada en BlueprintDetailPage
   * cuando recibe blueprint-update del servidor
   */
  const deduplicatePoints = (prevPoints, incomingPoints) => {
    if (!Array.isArray(incomingPoints) || !incomingPoints.length) {
      return prevPoints
    }

    // Si hay más de 1 punto, es una actualización completa del servidor
    if (incomingPoints.length > 1) {
      return incomingPoints
    }

    // Si hay 1 punto, verificar si es duplicado
    const [incomingPoint] = incomingPoints
    const last = prevPoints[prevPoints.length - 1]

    if (last && last.x === incomingPoint.x && last.y === incomingPoint.y) {
      return prevPoints // Duplicado, no agregar
    }

    return [...prevPoints, incomingPoint] // Nuevo punto, agregar
  }

  it('retorna prevPoints si incomingPoints está vacío', () => {
    const prev = [{ x: 0, y: 0 }]
    const result = deduplicatePoints(prev, [])
    expect(result).toEqual(prev)
  })

  it('retorna incomingPoints si hay más de 1 punto (actualización completa)', () => {
    const prev = [{ x: 0, y: 0 }]
    const incoming = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ]
    const result = deduplicatePoints(prev, incoming)
    expect(result).toEqual(incoming)
  })

  it('no agrega punto si es duplicado del último', () => {
    const prev = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ]
    const incoming = [{ x: 5, y: 5 }] // Duplicado del último
    const result = deduplicatePoints(prev, incoming)
    expect(result).toEqual(prev)
  })

  it('agrega punto si es diferente del último', () => {
    const prev = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ]
    const incoming = [{ x: 10, y: 10 }]
    const result = deduplicatePoints(prev, incoming)
    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 10 },
    ])
  })

  it('maneja prevPoints vacío correctamente', () => {
    const prev = []
    const incoming = [{ x: 5, y: 5 }]
    const result = deduplicatePoints(prev, incoming)
    expect(result).toEqual([{ x: 5, y: 5 }])
  })

  it('detecta duplicados incluso si hay múltiples decimales', () => {
    const prev = [{ x: 10.5, y: 20.3 }]
    const incoming = [{ x: 10.5, y: 20.3 }]
    const result = deduplicatePoints(prev, incoming)
    expect(result).toEqual(prev)
  })
})
