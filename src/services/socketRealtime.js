import { io } from 'socket.io-client'

let socket = null

const socketBaseUrl = import.meta.env.VITE_IO_BASE || 'http://localhost:3001'

export function isSocketConnected() {
  return Boolean(socket?.connected)
}

export function connectSocket() {
  if (socket?.connected) {
    return socket
  }

  socket = io(socketBaseUrl, {
    transports: ['websocket'],
    autoConnect: true,
  })

  return socket
}

export function disconnectSocket() {
  if (!socket) return
  socket.disconnect()
  socket = null
}

export function joinBlueprintRoom(author, name) {
  if (!socket) return
  const room = `blueprints.${author}.${name}`
  socket.emit('join-room', room)
}

export function emitDrawEvent({ author, name, point }) {
  if (!socket) return
  const room = `blueprints.${author}.${name}`
  socket.emit('draw-event', { room, author, name, point })
}

export function onBlueprintUpdate(handler) {
  if (!socket) return () => {}
  socket.on('blueprint-update', handler)

  return () => {
    socket?.off('blueprint-update', handler)
  }
}

export function onSocketError(handler) {
  if (!socket) return () => {}
  socket.on('connect_error', handler)

  return () => {
    socket?.off('connect_error', handler)
  }
}
