<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  import {
    showLoading,
    hideLoading,
    calculateCenter,
    VUE_APP_API_URL,
  } from '@/utils'

  const API = new Api()

  /** 标记点 */
  const markers = ref()
  /** 圆形标记点 */
  const circles = ref()
  /** 中心点纬度 */
  const latitude = ref(0)
  /** 中心点经度 */
  const longitude = ref(0)
  /** 设置地图的缩放级别 */
  const scale = 14

  /**
   * 获取今天的打卡记录
   */
  const getRouteHistory = async () => {
    showLoading()

    const res = await API.getRouteHistory({ id: 1 })

    hideLoading()

    if (res.code === 200) {
      // 计算出中心点经纬度坐标
      const { latitude: _latitude, longitude: _longitude } = calculateCenter(
        res.data
      )

      latitude.value = _latitude
      longitude.value = _longitude

      /** 获取用户头像 */
      const infoRes = await API.getUserInfo({ id: res.data[0].user_id })
      let iconPath = ''

      if (infoRes.code === 200) {
        iconPath = VUE_APP_API_URL + infoRes.data.avatar
      }

      if (res.data && res.data.length) {
        circles.value = res.data.map((item) => {
          return {
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            fillColor: '#333333',
            radius: 30,
          }
        })

        markers.value = res.data.map((item) => {
          return {
            id: item.id,
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            title: item.name,
            iconPath,
            width: 30,
            height: 30,
          }
        })
      }
    }
  }

  getRouteHistory()
</script>

<template>
  <div class="route-detail">
    <!-- https://uniapp.dcloud.net.cn/component/map.html -->
    <map
      v-if="markers && markers.length"
      class="map"
      :latitude="latitude"
      :circles="circles"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
    />
  </div>
</template>

<style lang="scss">
  .route-detail {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;

    .map {
      width: 100vw;
      height: 100vh;
    }
  }
</style>
