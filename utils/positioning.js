/**
 * 定位相关
 * 
 * @returns 
 */
export const usePositioning = () => {
  /**
   * 判断新选择的经纬度坐标是否不超过当前位置坐标指定公里范围内
   * 
   * @param lat1 
   * @param lon1 
   * @param lat2 
   * @param lon2 
   * @param kilometer 
   */
  const isExceed = (lat1, lon1, lat2, lon2, kilometer = 3) => {
    /** 地球半径，单位千米 */
    const earthRadiusKm = 6371

    /**
     * 将角度转换为弧度
     * 
     * @param deg 
     * @returns 
     */
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180)
    }

    /**
     * 计算两个坐标点之间的距离
     * 
     * @param lat1 
     * @param lon1 
     * @param lat2 
     * @param lon2 
     * @returns 
     */
    const haversine = (lat1, lon1, lat2, lon2) => {
      const dLat = deg2rad(lat2 - lat1)
      const dLon = deg2rad(lon2 - lon1)

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return earthRadiusKm * c
    }

    /** 计算两个坐标点之间的距离 */
    const distance = haversine(lat1, lon1, lat2, lon2)

    // 返回布尔值，指示新选择的坐标是否在 3 公里范围内
    return distance <= kilometer
  }

  /**
   * 获取当前的位置信息
   */
  const getAround = (callback) => {
    return () => {
      /**
       * @see getLocation https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
       */
      uni.getLocation({
        type: 'gcj02',
        altitude: true,
        isHighAccuracy: true,
        success: (data) => {
          console.log('当前位置', data)

          const { latitude, longitude } = data

          /**
           * 使用微信内置地图查看位置
           *
           * @see chooseLocation https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
           */
          uni.chooseLocation({
            success: (res) => {
              console.log('chooseLocation 获取成功', res)

              if (callback) {
                callback(res, latitude, longitude)
              }

            },
            fail: (info) => {
              console.log('openLocation 获取失败', info)
            },
          })
        },
        fail: (info) => {
          console.log('getLocation 获取失败', info)
        },
      })
    }
  }

  return {
    isExceed,
    getAround
  }
}

export const calculateCenter = (coordinates) => {
  if (coordinates.length === 0) {
    return null // 无坐标可用
  }

  // 初始化中心点的纬度和经度
  let totalLat = 0
  let totalLng = 0

  // 遍历所有对象并求和经纬度
  for (const coordinate of coordinates) {
    if (coordinate.latitude && coordinate.longitude) {
      totalLat + (coordinate.latitude)
      totalLng + (coordinate.longitude)
    }
  }

  // 计算平均纬度和经度
  const avgLat = totalLat / coordinates.length
  const avgLng = totalLng / coordinates.length

  return { latitude: avgLat, longitude: avgLng }
}