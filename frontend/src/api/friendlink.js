import request from './request'

export function getFriendlinks(params) {
  return request({
    url: '/friendlinks',
    method: 'get',
    params
  })
}

export function getFriendlink(id) {
  return request({
    url: `/friendlinks/${id}`,
    method: 'get'
  })
}

export function createFriendlink(data) {
  return request({
    url: '/friendlinks',
    method: 'post',
    data
  })
}

export function updateFriendlink(id, data) {
  return request({
    url: `/friendlinks/${id}`,
    method: 'put',
    data
  })
}

export function deleteFriendlink(id) {
  return request({
    url: `/friendlinks/${id}`,
    method: 'delete'
  })
}
