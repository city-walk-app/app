<script setup>
  import { Api } from '@/api'
  import { ref, computed, reactive } from 'vue'
  import {
    toast,
    getStorage,
    setStorage,
    uploadOSSImages,
    showLoading,
    hideLoading,
    goPage,
  } from '@/utils'
  import { USER_INFO, USER_TOKEN } from '@/enum'
  import { onLoad, onShow } from '@dcloudio/uni-app'
  import { useGlobalStore } from '@/store'
  import FilterPopup from '@/components/filter-popup'
  import Sheet from '@/components/sheet'

  const API = new Api()
  const useGlobal = useGlobalStore()

  /** 顶部状态栏高度 */
  const statusBarHeight = ref(0)
  /** 当前纬度 */
  const latitude = ref()
  /** 当前经度 */
  const longitude = ref()
  /** 地图标点集合 */
  const markers = ref()
  /** 是否开启卫星图 */
  const enableSatellite = ref(true)
  /** 是否显示对话框 */
  const visibleSheet = ref(false)
  /** 打开信息详情 */
  const recordDetail = ref({
    province_url:
      'https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/provinces/230000.png',
    background_color: '#F8D035',
  })
  /** 天气信息 */
  const weatherInfo = ref()
  /** 心情颜色 */
  const moodColors = ref([
    { color: '#f16a59', borderColor: '#ef442f', key: '', type: '' },
    { color: '#f6a552', borderColor: '#f39026', key: '', type: '' },
    { color: '#fad35c', borderColor: '#fac736', key: '', type: '' },
    { color: '#74cd6d', borderColor: '#50c348', key: '', type: '' },
    { color: '#4a8cf9', borderColor: '#1d6ff8', key: '', type: '' },
    { color: '#af72dc', borderColor: '#9b4fd3', key: '', type: '' },
    { color: '#9b9ca0', borderColor: '#838387', key: '', type: '' },
  ])
  /** 出行方式 */
  const travelMode = ref([
    { icon: '', key: '', type: '公交' },
    { icon: '', key: '', type: '地铁' },
    { icon: '', key: '', type: '自行车' },
    { icon: '', key: '', type: '步行' },
    { icon: '', key: '', type: '开车' },
    { icon: '', key: '', type: '火车' },
    { icon: '', key: '', type: '飞机' },
    { icon: '', key: '', type: '船' },
  ])
  /** 步行记录详情表单 */
  const routeDetailForm = reactive({
    route_id: '121212', // 步行 id
    content: '', // 内容
    travel_type: '', // 出行方式
    mood_color: '', // 心情颜色
    address: '', // 位置信息
    picture: [], // 照片
  })
  /** 选择的图片 */
  const pictureFileList = ref()

  /** 用户信息缓存 */
  const userInfoStorage = ref(getStorage(USER_INFO))
  /** 登录信息缓存 */
  const userTokenStorage = ref(getStorage(USER_TOKEN))

  /**
   * 切换是否开启卫星图
   */
  const changeEnableSatellite = () => {
    enableSatellite.value = !enableSatellite.value
  }

  /**
   * 是否为已经登录状态
   */
  const isLoginState = computed(() => {
    return !!(
      userTokenStorage.value &&
      userInfoStorage.value &&
      userInfoStorage.value.user_id
    )
  })

  /**
   * open id 登录
   */
  const loginOpenId = async (wx_open_id) => {
    const res = await API.loginOpenId({ wx_open_id })

    toast(res.message)

    if (res.code === 200) {
      userInfoStorage.value = res.data.user_info
      userTokenStorage.value = res.data.token

      setStorage(USER_INFO, res.data.user_info)
      setStorage(USER_TOKEN, res.data.token)
      return
    }

    toast(res.message)

    setTimeout(() => {
      goPage('/pages_bus/login/index')
    }, 500)
  }

  /**
   * 获取 open id
   */
  const getOpenId = async (code) => {
    const res = await API.getOpenId({ code })

    if (res.code === 200) {
      loginOpenId(res.data.openid)
      getLocation() // 获取位置信息
    }
  }

  /**
   * 微信登录
   */
  const wxLogin = async () => {
    const res = await uni.login()

    if (res.errMsg === 'login:ok') {
      getOpenId(res.code)
    }
  }

  /**
   * 关闭对话框
   */
  const closeSheet = () => {
    // visibleSheet.value = false
    // recordDetail.value = null
  }

  /**
   * 打开对话框
   */
  const openSheet = () => {
    visibleSheet.value = true
  }

  /**
   * 记录当前位置
   */
  const onRecord = async () => {
    const res = await uni.chooseLocation({ type: 'gcj02' })

    if (res.errMsg !== 'chooseLocation:ok') {
      toast('查看位置错误')
      return
    }

    const { latitude, longitude, name, address } = res

    console.log('打卡成功', res)

    /** 创建当前位置信息 */
    const result = await API.locationCreateRecord({
      latitude,
      longitude,
    })

    if (result.code === 200) {
      recordDetail.value = {
        ...result.data,
        province_url: result.data.province_code
          ? `https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/provinces/${result.data.province_code}.png`
          : '',
      }

      routeDetailForm.address = address + name
      routeDetailForm.route_id = result.data.route_id
      openSheet() // 打开对话框
      return
    }

    toast(result.message)
  }

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
   * 获取周边热门地点
   */
  const getLocationPopularRecommend = async () => {
    const res = await API.getLocationPopularRecommend({
      longitude: longitude.value,
      latitude: latitude.value,
    })

    if (res.code === 200 && res.data && res.data.length) {
      setMarkers(res.data)
    }
  }

  /**
   * 获取当前地区的天气
   */
  const getWeatherInfo = async () => {
    const res = await API.getWeatherInfo({
      longitude: longitude.value,
      latitude: latitude.value,
    })

    if (res.code === 200) {
      weatherInfo.value = res.data
    }
  }

  /**
   * 获取位置信息
   */
  const getLocation = async () => {
    /**
     * @see getLocation https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
     */
    const res = await uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
    })

    if (res.errMsg !== 'getLocation:ok') {
      toast('获取地理位置失败')
      return
    }

    longitude.value = res.longitude
    latitude.value = res.latitude

    // getLocationPopularRecommend() // 获取周边热门地点
    // getWeatherInfo() // 获取天气信息
  }

  /**
   * 跳转我的
   */
  const goMine = () => {
    if (!userInfoStorage.value || !userInfoStorage.value.user_id) {
      toast('未登录')
    }

    uni.navigateTo({
      url: `/pages/mine/index?user_id=${userInfoStorage.value.user_id}`,
    })
  }

  /**
   * 获取本地缓存数据
   */
  const getStorageData = () => {
    userInfoStorage.value = getStorage(USER_INFO)
    userTokenStorage.value = getStorage(USER_TOKEN)
  }

  /**
   * 获取邀请详情
   */
  const getFriendInviteInfo = async (invite_id) => {
    console.log('获取详情')
    const res = await API.getFriendInviteInfo({ invite_id })

    console.log(res)

    if (res.code === 200) {
      const modalRes = await uni.showModal({
        title: '好友申请',
        content: `${res.data.name} 申请加你为好友，你同意吗？`,
        showCancel: true,
        cancelText: '拒绝',
        confirmText: '同意',
      })

      console.log(modalRes)

      /**
       *        success: async (res) => {
          if (res.confirm) {
            const result = await API.friendConfirmInvite({ invite_id })

            if (result.code === 200) {
              console.log(result)
            }
            console.log('同意')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
       */
    }
  }

  /**
   * 点击标记的点触发
   */
  const markertap = (evt) => {
    console.log('点击标记的点触发', evt)
  }

  /**
   * 点击地图触发
   */
  const mapTap = (evt) => {
    console.log('点击地图触发', evt)
  }

  /**
   * 点击地图poi点时触发
   */
  const poitap = (evt) => {
    console.log('点击地图poi点时触发', evt)
  }

  /**
   *视野发生变化时触发
   */
  const regionchange = (evt) => {
    console.log('视野发生变化时触发', evt)
  }

  /**
   * 回到当前位置
   */
  const moveToCurrentLocation = async () => {
    const mapContext = uni.createMapContext('map')

    mapContext.moveToLocation()
  }

  /**
   * 完善步行打卡记录详情
   */
  const submitRouteDetail = async () => {
    showLoading()

    // 上传图片
    if (pictureFileList.value && pictureFileList.value.length) {
      const upRes = await uploadOSSImages(API, pictureFileList.value)

      console.log('上传的图片', upRes)

      routeDetailForm.picture = upRes.filter(Boolean)
    }

    const res = await API.updateRouteDetail(routeDetailForm)

    hideLoading()

    if (res.code === 200) {
      console.log(res)

      toast('提交成功')

      setTimeout(() => {
        visibleSheet.value = false
        recordDetail.value = null
      }, 500)
    }
  }

  /**
   * 选择照片
   */
  const choosePicture = async () => {
    const res = await uni.chooseImage({
      count: 2, // 选择图片的数量
      sourceType: ['album', 'camera'],
    })

    if (res.errMsg !== 'chooseImage:ok') {
      toast('上传异常，请重试')
      return
    }

    pictureFileList.value = res.tempFilePaths

    console.log(pictureFileList.value)
  }

  onLoad((options) => {
    if (options.invite_id) {
      getFriendInviteInfo(options.invite_id)
    }
  })

  onShow(() => {
    getStorageData() // 是否登录

    console.log(isLoginState.value)

    if (
      (userInfoStorage.value,
      userInfoStorage.value.user_id,
      userTokenStorage.value)
    ) {
      getLocation() // 获取位置信息
    }
  })
</script>

<template>
  <Sheet v-model:visible="visibleSheet" @on-close="closeSheet">
    <!-- 首页内容 -->
    <div class="home" :style="{ paddingTop: (statusBarHeight || 90) + 'px' }">
      <!-- 顶部模糊 -->
      <div
        class="header-gaussian"
        :style="{
          height: useGlobal.navBarHeight + 'px',
        }"
      />

      <!-- 头像 -->
      <div
        class="avatar-wrapper"
        :style="{
          top: useGlobal.navBarHeight + 16 + 'px',
        }"
        @click="goMine"
      >
        <image
          mode="aspectFill"
          class="avatar-wrapper-image"
          src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
        />
      </div>

      <!-- 操作按钮 -->
      <div
        class="options-wrapper"
        :style="{
          '--top': useGlobal.navBarHeight + 16 + 'px',
          '--background': enableSatellite
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.2)',
          '--border-color': enableSatellite
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.3)',
        }"
      >
        <!-- 进入设置页面 -->
        <div class="options-button" @click="goPage('/pages_bus/setting/index')">
          <image class="options-setting-icon" src="/assets/svg/setting.svg" />
        </div>
        <div class="options-group">
          <!-- 地图设置 -->
          <div class="options-group-item" @click="changeEnableSatellite">
            <image class="options-setting-icon" src="/assets/svg/map.svg" />
          </div>
          <div class="options-group-line" />
          <!-- 回到当前位置 -->
          <div class="options-group-item" @click="moveToCurrentLocation">
            <image
              class="options-setting-icon"
              src="/assets/svg/position.svg"
            />
          </div>
        </div>
      </div>

      <!-- 地图 -->
      <map
        v-if="latitude && longitude"
        id="map"
        class="map"
        show-location
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :enable-satellite="enableSatellite"
        @markertap="markertap"
        @tap="mapTap"
        @poitap="poitap"
        @regionchange="regionchange"
      />
      <!-- <div
      class="map"
      style="
        background: url('https://wxls-cms.oss-cn-hangzhou.aliyuncs.com/online/2024-04-18/218da022-f4bf-456a-99af-5cb8e157f7b8.jpg');
      "
    ></div> -->

      <!-- 天气 -->
      <div v-if="weatherInfo" class="weather">
        <div class="weather-header">
          <div class="weather-header-text">{{ weatherInfo.weather }}</div>
        </div>
        <div class="weather-body">{{ weatherInfo.temperature }}度</div>
      </div>

      <div v-else class="weather">
        <div class="weather-header">
          <div class="weather-header-text">多云</div>
        </div>
        <div class="weather-body">31度</div>
      </div>

      <!-- 底部卡片 -->
      <div class="footer">
        <div class="footer-group">
          <div
            class="footer-card footer-card-friends"
            style="
              --img: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-friends.png');
            "
            @click="goPage('/pages/friends/index')"
          >
            <div class="footer-card-background">
              <div class="footer-card-title">我到朋友</div>
              <div class="footer-card-content">My Friends</div>
            </div>
          </div>
          <div
            class="footer-card footer-card-invite"
            style="
              --img: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-invite.png');
            "
            @click="goPage('/pages/invite/index')"
          >
            <div class="footer-card-background">
              <div class="footer-card-title">邀请朋友</div>
              <div class="footer-card-content">City Walk Together</div>
            </div>
          </div>
        </div>
        <div class="footer-group">
          <div
            class="footer-card footer-card-record"
            style="
              --img: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-record.png');
            "
            @click="onRecord"
          >
            <div class="footer-card-background">
              <div class="footer-card-title">打卡</div>
              <div class="footer-card-content">Record location</div>
            </div>
          </div>
          <div
            class="footer-card footer-card-ranking"
            style="
              --img: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-ranking.png');
            "
            @click="goPage('/pages/ranking/index')"
          >
            <div class="footer-card-background">
              <div class="footer-card-title">排行榜</div>
              <div class="footer-card-content">Ranking</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部模糊 -->
      <div class="footer-gaussian" />
    </div>

    <!-- 弹窗内容 -->
    <template #content>
      <div v-if="recordDetail" class="home-sheet">
        <!-- 版图 -->
        <div class="home-sheet-jigsaw">
          <div
            class="home-sheet-jigsaw-image"
            :style="{
              '--province': `url('${recordDetail.province_url}')`,
              '--background': recordDetail.background_color,
            }"
          />
        </div>

        <!-- 图片文件 -->
        <template v-if="pictureFileList && pictureFileList.length">
          <image
            v-for="(item, index) in pictureFileList"
            class=""
            style="width: 30rpx; height: 30rpx"
            :src="item"
            :key="index"
          />
        </template>

        <!-- 文案 -->
        <div class="home-sheet-content">再获得100经验版图将会升温版图</div>

        <!-- 内容部分 -->
        <div class="home-sheet-content-body">
          <!-- 图片容器 -->
          <div class="home-sheet-content-body-picture-wrapper">
            <!-- 照相机 -->
            <div class="home-sheet-content-body-camera-wrapper">
              <image
                class="home-sheet-content-body-camera"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/record-succese-camera.png"
              />
            </div>

            <!-- 发布瞬间按钮 -->
            <div class="home-sheet-content-body-button" @click="choosePicture">
              发布瞬间
            </div>
          </div>

          <!-- 心情颜色 -->
          <div class="home-sheet-content-body-mood-colors">
            <div
              class="home-sheet-content-body-color"
              v-for="(item, index) in moodColors"
              :key="index"
              :style="{
                '--background': item.color,
                '--border-color': item.borderColor,
              }"
            />
          </div>

          <!-- 位置 -->
          <div class="home-sheet-content-body-position">
            <div class="home-sheet-content-body-position-text">
              <!-- 选择当前位置 -->
              {{ routeDetailForm.address }}
            </div>
          </div>

          <!-- 说点什么 -->
          <div class="home-sheet-content-body-speak">
            <!-- <div class="home-sheet-content-body-speak-text">说点什么？</div> -->
            <div class="home-sheet-content-body-speak-text">
              <textarea
                class="home-sheet-content-body-speak-text-textarea"
                v-model="routeDetailForm.content"
              />
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="home-sheet-content-footer">
          <div class="home-sheet-content-footer-no">取消</div>
          <div class="home-sheet-content-footer-ok" @click="submitRouteDetail">
            就这样
          </div>
        </div>
      </div>
    </template>
  </Sheet>

  <!-- 登录提示弹出层 -->
  <FilterPopup v-model:visible="isLoginState">
    <div class="home-popup-login">
      <!-- 头部 logo -->
      <div class="home-popup-login-header">
        <image
          mode="aspectFill"
          class="home-popup-login-header-logo"
          src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/logo.jpg"
        />
      </div>

      <!-- 内容 -->
      <div class="home-popup-login-body">
        <div>当前尚未登录</div>
        <div>登录后体验完整功能</div>
      </div>

      <!-- 操作 -->
      <div class="home-popup-login-footer">
        <div
          class="home-popup-login-footer-email"
          @click="goPage('/pages_bus/login/index')"
        >
          邮箱登录
        </div>
        <div class="home-popup-login-footer-vite" @click="wxLogin">
          快捷登录
        </div>
      </div>
    </div>
  </FilterPopup>
</template>

<style lang="scss">
  // 首页
  .home {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;

    // 顶部高斯模糊
    .header-gaussian {
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9;
      mask-image: linear-gradient(
        180deg,
        #fff 0%,
        rgb(255, 255, 255, 0.8) 64%,
        transparent
      );
      backdrop-filter: blur(80px);
    }

    // 头像
    .avatar-wrapper {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      position: fixed;
      left: 32rpx;
      background-color: #ddd;
      z-index: 20;

      .avatar-wrapper-image {
        width: inherit;
        height: inherit;
        border-radius: inherit;
      }
    }

    // 操作
    .options-wrapper {
      position: fixed;
      right: 32rpx;
      top: var(--top);
      z-index: 20;
      display: flex;
      flex-direction: column;
      row-gap: 36rpx;

      // 设置
      .options-button {
        width: 84rpx;
        height: 84rpx;
        backdrop-filter: blur(15rpx);
        background-color: var(--background);
        border: 1rpx solid var(--border-color);
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        // icon
        .options-setting-icon {
          width: 44rpx;
          height: 44rpx;
          flex-shrink: 0;
        }
      }

      // 组
      .options-group {
        width: 84rpx;
        height: 168rpx;
        backdrop-filter: blur(15rpx);
        background-color: var(--background);
        border: 1rpx solid var(--border-color);
        border-radius: 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .options-group-item {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;

          // icon
          .options-setting-icon {
            width: 44rpx;
            height: 44rpx;
            flex-shrink: 0;
          }
        }

        .options-group-line {
          width: 56rpx;
          height: 2rpx;
          background: #e4e4e4;
        }
      }
    }

    // 地图
    .map {
      width: 100vw;
      height: 100vh;
      position: fixed;
      inset: 0;
    }

    // 天气
    .weather {
      position: fixed;
      left: 32rpx;
      z-index: 30;
      bottom: 594rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      // 天气信息
      .weather-header {
        width: 81rpx;
        height: 83rpx;
        background: rgba(255, 255, 255, 0.5);
        box-shadow: 0rpx 0rpx 9rpx 2rpx rgba(255, 185, 57, 0.3);
        border-radius: 50%;
        border: 2rpx solid #ffffff;
        display: flex;
        justify-content: center;
        overflow: hidden;
        position: relative;

        // 天气文字描述
        .weather-header-text {
          align-items: center;
          font-size: 24rpx;
          color: #fe8718;
          font-weight: 600;
          white-space: nowrap;
          position: absolute;
          top: 20rpx;
          margin: auto;
          max-width: 80rpx;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      // 天气气温
      .weather-body {
        width: 100rpx;
        height: 38rpx;
        background: linear-gradient(180deg, #fe8718 0%, #fec43d 100%);
        box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(82, 134, 250, 0.4);
        border-radius: 36rpx 36rpx 36rpx 36rpx;
        border: 2rpx solid #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 20rpx;
        color: #ffffff;
        line-height: 23rpx;
        position: relative;
        top: -25rpx;
      }
    }

    // 底部操作栏
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 24rpx;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 32rpx 32rpx calc(16px + env(safe-area-inset-bottom)) 32rpx;
      box-sizing: border-box;
      z-index: 30;

      // 组
      .footer-group {
        flex: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        row-gap: 24rpx;

        .footer-card {
          position: relative;
          z-index: 10;
          transition: transform 0.26s;

          .footer-card-background {
            position: absolute;
            padding: 28rpx 32rpx;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            inset: 0;
            z-index: 30;
            background: var(--img) no-repeat center / cover;
          }

          // // 模糊背景
          // &::before {
          //   content: '';
          //   border-radius: 20rpx;
          //   position: absolute;
          //   inset: 0;
          //   top: 10rpx;
          //   z-index: -1;
          //   background: var(--img);
          //   background-size: cover;
          //   filter: blur(12rpx) brightness(1.1);
          // }

          // 主题
          .footer-card-title {
            font-family: Douyin Sans, Douyin Sans;
            font-weight: bold;
            font-size: 32rpx;
            color: #ffffff;
            line-height: 38rpx;
          }

          // 内容
          .footer-card-content {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #ffffff;
            line-height: 34rpx;
            max-width: 110rpx;
          }
        }

        .footer-card-friends {
          width: 332rpx;
          height: 196rpx;
        }

        .footer-card-record {
          width: 330rpx;
          height: 240rpx;
        }

        .footer-card-invite {
          width: 332rpx;
          height: 196rpx;
        }

        .footer-card-ranking {
          width: 330rpx;
          height: 152rpx;
        }
      }
    }

    // 底部模糊
    .footer-gaussian {
      width: 100vw;
      height: 380rpx;
      // background: linear-gradient(180deg, transparent, #fff 43%);
      // background: linear-gradient(
      //   180deg,
      //   rgba(255, 255, 255, 0) 20%,
      //   #ffffff 43%
      // );
      // // background-color: transparent;
      // // background: hsla(0, 0%, 100%, 0.75);
      // // -webkit-backdrop-filter: blur(5px);
      // // backdrop-filter: blur(5px);
      // // background: hsla(0, 0%, 100%, 0.2);
      // -webkit-backdrop-filter: blur(25rpx);
      // backdrop-filter: blur(25rpx);
      position: fixed;
      z-index: 9;
      right: 0;
      left: 0;
      bottom: 0;
      mask-image: linear-gradient(
        0deg,
        #fff 0%,
        rgb(255, 255, 255, 0.8) 84%,
        transparent
      );
      backdrop-filter: blur(30px);
    }
  }

  // 登录提示弹出层
  .home-popup-login {
    padding: 110rpx 34rpx calc(34rpx + env(safe-area-inset-bottom)) 34rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-content: space-between;
    flex: 1;

    // 头部 logo
    .home-popup-login-header {
      width: 300rpx;
      height: 300rpx;
      border-radius: 50%;

      .home-popup-login-header-logo {
        width: inherit;
        height: inherit;
        border-radius: inherit;
      }
    }

    // 内容
    .home-popup-login-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    // 底部操作
    .home-popup-login-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 46rpx;

      .home-popup-login-footer-email {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 320rpx;
        height: 96rpx;
        border-radius: 28rpx;
        border: 3rpx solid #f3943f;
        font-weight: 400;
        font-size: 32rpx;
        color: #f3943f;
        line-height: 38rpx;
        background-color: #fff;
      }

      .home-popup-login-footer-vite {
        width: 320rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 96rpx;
        background: #f3943f;
        border-radius: 28rpx;
        border: 3rpx solid #f3943f;
        font-weight: 400;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 38rpx;
      }
    }
  }

  // 弹窗内容
  .home-sheet {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 32rpx;
    box-sizing: border-box;
    position: relative;
    flex: 1;

    // 版图
    .home-sheet-jigsaw {
      width: 308rpx;
      height: 308rpx;
      flex-shrink: 0;

      .home-sheet-jigsaw-image {
        width: inherit;
        height: inherit;
        mask: var(--province) 0 0 / cover no-repeat;
        -webkit-mask: var(--province) 0 0 / cover no-repeat;
        background: var(--background);
      }
    }

    // 文案
    .home-sheet-content {
      margin-top: 18rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
      line-height: 33rpx;
    }

    // 内容
    .home-sheet-content-body {
      width: 100%;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
      border-radius: 44rpx 44rpx 44rpx 44rpx;
      border: 2rpx solid;
      border-image: linear-gradient(
          162deg,
          rgba(255, 255, 255, 1),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        )
        2 2;
      padding: 32rpx;
      box-sizing: border-box;
      margin-top: 32rpx;

      // 图片容器
      .home-sheet-content-body-picture-wrapper {
        width: 100%;
        min-height: 282rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #ffffff 100%);
        box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
        border-radius: 28rpx;
        border: 2rpx solid;
        border-image: linear-gradient(
            153deg,
            rgba(255, 231, 190, 1),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          )
          2 2;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        // 照相机
        .home-sheet-content-body-camera-wrapper {
          width: 138rpx;
          height: 128rpx;
          flex-shrink: 0;

          .home-sheet-content-body-camera {
            width: inherit;
            height: inherit;
          }
        }

        // 发布瞬间
        .home-sheet-content-body-button {
          margin-top: 26rpx;
          width: 320rpx;
          height: 80rpx;
          background: #f3943f;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          border: 3rpx solid #f3943f;
          font-weight: 400;
          font-size: 32rpx;
          color: #ffffff;
          line-height: 38rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      // 心情颜色
      .home-sheet-content-body-mood-colors {
        display: flex;
        align-items: center;
        margin-top: 32rpx;
        justify-content: space-between;
        flex-wrap: nowrap;

        .home-sheet-content-body-color {
          width: 74rpx;
          height: 74rpx;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2rpx solid var(--border-color);
          background-color: var(--background);
        }
      }

      // 位置
      .home-sheet-content-body-position {
        width: 100%;
        height: 96rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #ffffff 100%);
        box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
        border-radius: 28rpx;
        border: 2rpx solid;
        border-image: linear-gradient(
            153deg,
            rgba(255, 231, 190, 1),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          )
          2 2;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-top: 32rpx;

        .home-sheet-content-body-position-text {
          font-weight: 400;
          font-size: 32rpx;
          color: #666666;
          line-height: 38rpx;
          text-align: left;
        }
      }

      // 说点什么
      .home-sheet-content-body-speak {
        width: 100%;
        height: 124rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #ffffff 100%);
        box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
        border-radius: 28rpx;
        border: 2rpx solid;
        border-image: linear-gradient(
            153deg,
            rgba(255, 231, 190, 1),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          )
          2 2;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-top: 32rpx;
        position: relative;

        .home-sheet-content-body-speak-text {
          font-weight: 500;
          font-size: 36rpx;
          color: #666666;
          line-height: 42rpx;
          position: absolute;
          inset: 0;
          overflow: hidden;

          .home-sheet-content-body-speak-text-textarea {
            position: absolute;
            inset: 0;
          }
        }
      }
    }

    // 底部操作
    .home-sheet-content-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 46rpx;
      // position: absolute;
      // bottom: 40rpx;
      // right: 32rpx;
      // left: 32rpx;

      .home-sheet-content-footer-no {
        width: 320rpx;
        height: 96rpx;
        border-radius: 28rpx;
        background-color: #fff;
        border: 3rpx solid #f3943f;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 32rpx;
        color: #f3943f;
        line-height: 38rpx;
      }

      .home-sheet-content-footer-ok {
        width: 320rpx;
        height: 96rpx;
        background: #f3943f;
        border-radius: 28rpx;
        border: 3rpx solid #f3943f;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 38rpx;
      }
    }
  }
</style>
