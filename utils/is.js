/**
 * 检测一个数据是否为 number 类型
 *
 */
export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value)
}
