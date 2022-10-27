import { axios } from '@/utils/request'

export function getBillboard() {
  return axios({
    url: '/community/billboard/show',
    method: 'get'
  })
}
