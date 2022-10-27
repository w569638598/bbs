import { axios } from '@/utils/request'

export function getTodayTip() {
  return axios({
    url: '/community/tip/today',
    method: 'get'
  })
}
