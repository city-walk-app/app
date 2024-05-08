const { toString } = Object.prototype

/**
 * 检测一个值是否为指定的类型
 *
 * @param value 要检测的值
 * @param type 预期类型
 */
export const is = (value, type) => {
  return toString.call(value) === `[object ${type}]`
}

/**
 * 检测一个数据是否为 date 类型
 *
 * @param value 要检测的值
 */
export const isDate = (value) => is(value, 'Date')

/**
 * 检测一个数据是否为 string 类型
 *
 * @param value 要检测的值
 */
export const isString = (value) => typeof value === 'string'

/**
 * 检测一个数据是否为 number 类型
 *
 * @param value 要检测的数据
 * @see isNaN() https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN
 */
export const isNumber = (value) =>
  typeof value === 'number' && !isNaN(value)

/**
 * 检测一个数据是否为 boolean 类型
 *
 * @param value 要检测的数据
 */
export const isBoolean = (value) => is(value, 'Boolean')

/**
 * 判断一个值是否为 object 类型
 *
 * @param value 要检测的值
 */
export const isObject = (value) => is(value, 'Object')

/**
 * 判断一个值是否为 function 类型
 *
 * @param value 要检测的值
 */
export const isFunction = (value) =>
  typeof value === 'function'

/**
 * 判断一个值是否为 array 类型
 *
 * @param value 要检测的值
 */
export const isArray = Array.isArray
