import request from './request'

export function getCards(params) {
  return request({
    url: '/cards',
    method: 'get',
    params
  })
}

export function getCard(id) {
  return request({
    url: `/cards/${id}`,
    method: 'get'
  })
}

export function createCard(data) {
  return request({
    url: '/cards',
    method: 'post',
    data
  })
}

export function updateCard(id, data) {
  return request({
    url: `/cards/${id}`,
    method: 'put',
    data
  })
}

export function deleteCard(id) {
  return request({
    url: `/cards/${id}`,
    method: 'delete'
  })
}

export function searchCards(q) {
  return request({
    url: '/cards/search',
    method: 'get',
    params: { q }
  })
}

export function parseWebsite(url) {
  return request({
    url: '/cards/parse',
    method: 'post',
    data: { url }
  })
}
