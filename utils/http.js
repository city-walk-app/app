import { USER_TOKEN } from '@/enum'
import { getStorage, toast, clearStorage } from '@/utils'

export const VUE_APP_API_URL = 'https://api.city-walk.top' // 生产环境
// const VUE_APP_API_URL = 'http://localhost:1219' // 本地环境

export class Http {
  /**
   * 请求
   */
  async request({
    url = '',
    data = {},
    method = 'POST',
    header = { token: '' }
  } = {}) {
    const userTokenStorage = getStorage(USER_TOKEN)

    // 在请求头设置 token
    if (userTokenStorage) {
      header.token = userTokenStorage
    }

    try {
      const res = await uni.request({
        url: VUE_APP_API_URL + url,
        data,
        header,
        method,
      })

      if (res.errMsg !== 'request:ok') {
        toast('网络连接失败')
        return
      }

      // 成功状态
      if (res.statusCode === 200 || res.statusCode === 201) {
        return res.data
      }
      // 未登录
      else if (res.statusCode === 401) {
        clearStorage()
        uni.navigateTo({ url: '/pages/home/index' })
        toast(res.data.message)
        return {}
      }
      // 提示错误
      else {
        toast(res.data.message)
        return {}
      }
    } catch (err) {
      console.log('全局请求异常', err)
      return {}
    }
  }
}