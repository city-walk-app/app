import { isFunction } from '.'

/**
 * 执行方法
 * 
 * @param callback 回调函数
 * @param params 回调函数参数
 */
export const run = (callback, ...params) => {
  isFunction(callback) && callback(...params)
}

/**
 * 检测是否为邮箱
 * 
 * @param email 邮箱 
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

/**
 * 防抖
 * 
 * @param func 执行方法
 * @param wait 间隔
 */
export const throttle = (func, wait = 200) => {
  let timeout

  return function (...args) {
    const context = this

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 数组去重
 */
export const deduplicateArray = (arr, key) => {
  return arr.reduce((uniqueArray, currentItem) => {
    // 检查当前项的 id 是否在已有的唯一数组中存在
    const existingItem = uniqueArray.find(item => item[key] === currentItem[key])

    // 如果不存在，则将当前项添加到唯一数组中
    if (!existingItem) {
      uniqueArray.push(currentItem)
    }

    return uniqueArray
  }, [])
}
