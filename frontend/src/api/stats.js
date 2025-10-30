import request from './request'

export function getStats() {
  return request({
    url: '/stats',
    method: 'get'
  })
}

export function getLoginLogs(params) {
  return request({
    url: '/stats/logs',
    method: 'get',
    params
  })
}
