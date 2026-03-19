const RT_MODE_KEY = 'rt-mode'
const RT_MODE_CHANGED_EVENT = 'rt-mode-changed'

const VALID_MODES = new Set(['none', 'socketio', 'stomp'])

export function getRealtimeMode() {
  const saved = (localStorage.getItem(RT_MODE_KEY) || 'none').toLowerCase()
  return VALID_MODES.has(saved) ? saved : 'none'
}

export function setRealtimeMode(mode) {
  const normalized = String(mode || 'none').toLowerCase()
  const value = VALID_MODES.has(normalized) ? normalized : 'none'
  localStorage.setItem(RT_MODE_KEY, value)
  window.dispatchEvent(new Event(RT_MODE_CHANGED_EVENT))
}

export function subscribeRealtimeModeChanges(handler) {
  window.addEventListener('storage', handler)
  window.addEventListener(RT_MODE_CHANGED_EVENT, handler)

  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener(RT_MODE_CHANGED_EVENT, handler)
  }
}
