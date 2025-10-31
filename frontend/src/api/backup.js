import request from './request'

export function getBackupInfo() {
  return request({
    url: '/backup/info',
    method: 'get'
  })
}

export function downloadBackup() {
  return request({
    url: '/backup/download',
    method: 'get',
    responseType: 'blob'
  })
}

export function restoreBackup(file) {
  const formData = new FormData()
  formData.append('backup', file)
  
  return request({
    url: '/backup/restore',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
