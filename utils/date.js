/**
 * 获取当前格式化后的时间
 */
export const getCurrentDateFormatted = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，故+1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 格式化时间配置对象
 */
const formatTimeOptions = { hour: '2-digit', minute: '2-digit' }

/**
 * 格式化当前时间
 * 
 * @param dateStr 时间
 */
export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString(void 0, formatTimeOptions)
}