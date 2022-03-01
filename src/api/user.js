import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function cookie_login(data) {
  return request({
    url: '/admin/cookie_login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/user/info',
    url: '/admin/info',
    // method: 'get',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/user/logout',
    url: '/admin/logout',
    method: 'post'
  })
}

export function sendSms(data) {
  return request({
    url: '/admin/send/sms',
    method: 'post',
    data
  })
}
