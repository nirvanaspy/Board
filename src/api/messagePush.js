import request from '../utils/request'

export function pushMessage(data) {
  return request({
    url: 'boards/push-message',
    method: 'post',
    data
  })
}
