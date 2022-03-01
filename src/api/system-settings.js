import request from '@/utils/request'

export function getSettings(data) {
  return request({
    url: '/system/get_settings',
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url: '/system/page',
    method: 'post',
    data
  })
}

export function insert(data) {
  return request({
    url: '/system/insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/system/replace',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/system/delete',
    method: 'post',
    data
  })
}
