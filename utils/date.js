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
 * 格式化当前时间
 * 
 * @param dateStr 时间
 */
export const formatTime = (dateStr) => {
  const date = new Date(dateStr)

  // 获取小时和分钟
  let hours = date.getUTCHours()
  let minutes = date.getUTCMinutes()

  // 将小时和分钟转换为两位数的字符串
  hours = hours.toString().padStart(2, '0')
  minutes = minutes.toString().padStart(2, '0')

  return `${hours}:${minutes}`
}