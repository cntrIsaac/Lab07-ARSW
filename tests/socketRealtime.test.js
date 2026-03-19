import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  connectSocket,
  disconnectSocket,
  joinBlueprintRoom,
  emitDrawEvent,
  onBlueprintUpdate,
  onSocketStatusChange,
  getSocketStatus,
  isSocketConnected,
} from '../src/services/socketRealtime.js'

// Mock socket.io-client
vi.mock('socket.io-client', () => {
  const mockSocket = {
    connected: false,
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  }

  return {
    io: vi.fn(() => mockSocket),
  }
})

describe('socketRealtime service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    disconnectSocket()
  })

  describe('getSocketStatus', () => {
    it('retorna "disconnected" cuando no hay socket', () => {
      const status = getSocketStatus()
      expect(status).toBe('disconnected')
    })

    it('retorna "disconnected" cuando socket no está conectado', () => {
      connectSocket()
      const status = getSocketStatus()
      expect(status).toBe('disconnected')
    })
  })

  describe('isSocketConnected', () => {
    it('retorna false cuando no hay socket', () => {
      expect(isSocketConnected()).toBe(false)
    })
  })

  describe('connectSocket', () => {
    it('crea una conexión socket', () => {
      const socket = connectSocket()
      expect(socket).toBeDefined()
    })

    it('retorna la misma instancia de socket si ya está conectado', () => {
      const socket1 = connectSocket()
      const socket2 = connectSocket()
      expect(socket1).toBe(socket2)
    })
  })

  describe('joinBlueprintRoom', () => {
    it('emite join-room con el formato correcto', () => {
      const socket = connectSocket()
      const author = 'alice'
      const name = 'blueprint1'

      joinBlueprintRoom(author, name)

      expect(socket.emit).toHaveBeenCalledWith('join-room', `blueprints.${author}.${name}`)
    })

    it('no emite si el socket no existe', () => {
      disconnectSocket()
      expect(() => joinBlueprintRoom('alice', 'blueprint1')).not.toThrow()
    })
  })

  describe('emitDrawEvent', () => {
    it('emite draw-event con payload correcto', () => {
      const socket = connectSocket()
      const point = { x: 10, y: 20 }
      const author = 'alice'
      const name = 'blueprint1'

      emitDrawEvent({ author, name, point })

      const expectedRoom = `blueprints.${author}.${name}`
      expect(socket.emit).toHaveBeenCalledWith('draw-event', {
        room: expectedRoom,
        author,
        name,
        point,
      })
    })

    it('no emite si el socket no existe', () => {
      disconnectSocket()
      expect(() => emitDrawEvent({ author: 'alice', name: 'blueprint1', point: { x: 0, y: 0 } })).not.toThrow()
    })
  })

  describe('onBlueprintUpdate', () => {
    it('retorna función para desuscribirse', () => {
      const socket = connectSocket()
      const handler = vi.fn()

      const unsubscribe = onBlueprintUpdate(handler)

      expect(typeof unsubscribe).toBe('function')
      expect(socket.on).toHaveBeenCalledWith('blueprint-update', handler)
    })

    it('registra el listener en el socket', () => {
      const socket = connectSocket()
      const handler = vi.fn()

      onBlueprintUpdate(handler)

      expect(socket.on).toHaveBeenCalledWith('blueprint-update', handler)
    })
  })

  describe('onSocketStatusChange', () => {
    it('retorna función para desuscribirse', () => {
      const handler = vi.fn()
      const unsubscribe = onSocketStatusChange(handler)

      expect(typeof unsubscribe).toBe('function')
    })
  })

  describe('disconnectSocket', () => {
    it('desconecta y limpia el socket', () => {
      const socket = connectSocket()
      disconnectSocket()

      expect(socket.disconnect).toHaveBeenCalled()
    })
  })
})
