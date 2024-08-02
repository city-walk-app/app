/**
 * 提示信息
 * 
 * @param title 标题
 * @param icon icon
 */
export const toast = (title, icon = 'none') => {
  uni.showToast({ title, icon })
}

/**
 * 开始 loading
 * 
 * @param title loading 文字
 */
export const showLoading = (title = '加载中...') => {
  uni.showLoading({ title, mask: true })
}

/**
 * 隐藏 loading
 */
export const hideLoading = uni.hideLoading

/**
 * 预览图片
 */
export const previewImage = async (urls, current) => {
  try {
    await uni.previewImage({ urls, current })
  } catch (err) {
    console.log('预览失败', err)
  }
}


/**
 * 获取本地存储
 */
export const getStorage = (key) => {
  return uni.getStorageSync(key)
}

/**
 * 设置本地存储
 */
export const setStorage = (key, value) => {
  return uni.setStorageSync(key, value)
}

/**
 * 清楚本地缓存数据
 */
export const clearStorage = uni.clearStorageSync

/**
 * 跳转登录
 */
export const goPage = (url) => {
  uni.navigateTo({ url })
}