
import { jwtDecode } from 'jwt-decode'

type jwtDecodedToken = {
  exp: number
  sub: string
  name: string
  email: string
}

function handleAuthAndLang(lang: string, token: string): boolean {
  localStorage.setItem('language', lang)
  return isAuthenticated(token)
}

export const checkAuth = (): boolean => {

  const params = new URLSearchParams(window.location.search)
  const codeParams = params.get('code')
  const issParams = params.get('iss')
  const tokenParams = params.get('token')
  const langParams = params.get('lang')

  const tokenStorage = localStorage.getItem('token') as string
  const langStorage = localStorage.getItem('language') as string

  if (codeParams && issParams && !tokenParams) {
    try {
      const redirectUrl = `${import.meta.env.VITE_AUTH_MODULE_URL}/sso?iss=${issParams}&code=${codeParams}`
      window.location.href = redirectUrl

      setTimeout(() => {
        if (window.location.href.indexOf(redirectUrl) === -1) {
          console.error('Redirecionamento falhou, tentando window.location.replace')
          window.location.replace(redirectUrl)
        }
      }, 1000)
    } catch (err) {
      console.error('Erro no redirecionamento:', err)
    }
    return true
  } else if (langParams && tokenParams) {
    const isAuth = handleAuthAndLang(langParams, tokenParams)
    const cleanUrl = `${window.location.origin}${window.location.pathname}`
    window.history.replaceState({}, document.title, cleanUrl)
    return isAuth
  } else if (tokenStorage) {
    return handleAuthAndLang(langStorage, tokenStorage)
  } else {
    return false
  }
}

const isAuthenticated = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as jwtDecodedToken
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp < now) {
      console.warn('Token expirado. Limpando sessão...')
      cleanAuthStorage()
      return false
    } else {
      saveAuthStorage(token, decoded.name, decoded.email, decoded.sub)
      return true
    }
  } catch (err) {
    console.error('Token inválido', err)
    return false
  }
}

const cleanAuthStorage = (): void => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('sub')
  sessionStorage.removeItem('name')
  sessionStorage.removeItem('email')
}

const saveAuthStorage = (token: string, name: string, email: string, sub: string): void => {
  localStorage.setItem('token', token)
  sessionStorage.setItem('sub', sub)
  sessionStorage.setItem('name', name)
  sessionStorage.setItem('email', email)
}
