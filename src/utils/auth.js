import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSkey() {
  return Cookies.get('w_skey')
}

export function getOpenId() {
  return Cookies.get('w_open_id')
}

export function getUID() {
  return Cookies.get('w_uid')
}

export function getExpire() {
  return Cookies.get('w_expires_in')
}
