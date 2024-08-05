<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { getStorage, isArray } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { useGlobalStore } from '@/store'

  const API = new Api()

  const useGlobal = useGlobalStore()

  const userInfo = ref(getStorage(USER_INFO))
  /** 地图标点集合 */
  const markers = ref()
  /** 当前纬度 */
  const latitude = ref()
  /** 当前经度 */
  const longitude = ref()

  /**
   * 设置地图标点
   */
  const setMarkers = (data) => {
    console.log(data)
    const markerList = data.map((item, index) => {
      return {
        iconPath:
          'https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-markers.svg',
        width: 35,
        height: 42,
        id: index,
        latitude: item.latitude,
        longitude: item.longitude,
      }
    })

    markers.value = markerList
  }

  /**
   * 获取用户步行记录列表
   */
  const getUserRouteDetail = async (list_id) => {
    try {
      const res = await API.getUserRouteDetail({
        list_id,
        user_id: userInfo.value.user_id,
      })

      if (res.code === 200) {
        if (isArray(res.data) && res.data.length) {
          latitude.value = res.data[0].latitude
          longitude.value = res.data[0].longitude

          setMarkers(res.data) // 设置地图标点
        }
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 返回
   */
  const back = () => {
    uni.navigateBack({ delta: 1 })
  }

  onLoad((options) => {
    console.log(options)
    getUserRouteDetail(options.list_id) // 获取用户步行记录列表
  })
</script>

<template>
  <div class="route-detail">
    <!-- 返回按钮 -->
    <div
      class="back"
      :style="{
        top: useGlobal.headerBtnPosi.top + 'px',
      }"
      @click="back"
    >
      <image class="back-icon" src="/assets/svg/left.svg" />
    </div>

    <!-- 地图 -->
    <map
      id="map"
      class="map"
      :show-location="false"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :enable-satellite="false"
    />
  </div>
</template>

<style lang="scss">
  .route-detail {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;

    // 地图
    .map {
      width: 100vw;
      height: 100vh;
      position: fixed;
      inset: 0;
    }

    // 返回
    .back {
      width: 68rpx;
      height: 68rpx;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 0rpx 2rpx 23rpx 0rpx rgba(158, 158, 158, 0.25);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 32rpx;
      z-index: 20;

      .back-icon {
        width: 50rpx;
        height: 50rpx;
        flex-shrink: 0;
      }
    }
  }
</style>
