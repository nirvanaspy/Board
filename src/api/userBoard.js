import request from '../utils/request'

export function userBoardsList() {
  return request({
    url: 'boards/show-layout',
    method: 'get'
  })
}
