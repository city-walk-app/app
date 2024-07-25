import { USER_INFO } from '@/enum'
import { getStorage, toast } from '@/utils'

export const VUE_APP_API_URL = 'https://api.city-walk.top' // 生产环境
// export const VUE_APP_API_URL = 'http://localhost:1219' // 本地环境

export class Http {
  request({
    url = '',
    data = {},
    method = 'GET',
    header = { token: '' }
  } = {}) {
    const userInfoStorage = getStorage(USER_INFO)

    // 在请求头设置 token
    if (userInfoStorage) {
      header.token = userInfoStorage.token
    }

    return new Promise((resolve) => {
      uni.request({
        url: VUE_APP_API_URL + url,
        data,
        header,
        method,
        success: (res) => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(res.data)
          } else {
            toast(res.data.message)
          }
        },
        fail: () => {
          toast('网络连接失败')
        }
      })
    })
  }
}