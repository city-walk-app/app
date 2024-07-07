<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  // import {
  //   showLoading,
  //   hideLoading,
  //   calculateCenter,
  //   VUE_APP_API_URL,
  // } from '@/utils'

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

  // getRouteHistory()
</script>

<template>
  <div class="route-detail">
    <!-- https://uniapp.dcloud.net.cn/component/map.html -->
    <map class="map" :latitude="latitude" :longitude="longitude" />
    <!-- <map
      class="map"
      :latitude="latitude"
      :circles="circles"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
    /> -->
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
