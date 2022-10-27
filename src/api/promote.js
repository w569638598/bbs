import { axios } from '@/utils/request'

// 获取推广
export function getList() {
  return axios(({
    url: '/community/promotion/all',
    method: 'get'
  }))
}
