import request from './request'

export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

export function getProfile() {
  return request({
    url: '/auth/profile',
    method: 'get'
  })
}

export function updatePassword(oldPassword, newPassword) {
  return request({
    url: '/auth/password',
    method: 'put',
    data: { oldPassword, newPassword }
  })
}
