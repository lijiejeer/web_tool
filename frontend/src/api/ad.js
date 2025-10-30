import request from './request'

export function getAds(params) {
  return request({
    url: '/ads',
    method: 'get',
    params
  })
}

export function getAd(id) {
  return request({
    url: `/ads/${id}`,
    method: 'get'
  })
}

export function createAd(data) {
  return request({
    url: '/ads',
    method: 'post',
    data
  })
}

export function updateAd(id, data) {
  return request({
    url: `/ads/${id}`,
    method: 'put',
    data
  })
}

export function deleteAd(id) {
  return request({
    url: `/ads/${id}`,
    method: 'delete'
  })
}
