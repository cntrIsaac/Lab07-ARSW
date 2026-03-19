const TOKEN_KEY = 'token'
const AUTH_CHANGED_EVENT = 'auth-changed'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function subscribeAuthChanges(handler) {
  window.addEventListener('storage', handler)
  window.addEventListener(AUTH_CHANGED_EVENT, handler)

  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener(AUTH_CHANGED_EVENT, handler)
  }
}
