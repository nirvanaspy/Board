import request from '../utils/request'

export function boardsList(listQuery) {
  return request({
    url: 'boards',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page,
      deleted: false
    }
  })
}

export function createBoard(data) {
  return request({
    url: 'boards/boards',
    method: 'post',
    data
  })
}

export function updateBoard(data, id) {
  return request({
    url: 'boards/' + id,
    method: 'patch',
    data
  })
}

export function deleteBoard(id) {
  return request({
    url: 'boards/' + id,
    method: 'delete'
  })
}

export function saveLayoutByBoard(id, data) {
  return request({
    url: 'boards/' + id + '/layout',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    method: 'post',
    data
  })
}

export function getLayoutByBoard(id) {
  return request({
    url: 'boards/' + id + '/layout',
    method: 'get'
  })
}
