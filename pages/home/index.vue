<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  import { toast, getStorage, setStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { onLoad, onShow } from '@dcloudio/uni-app'
  import { useGlobalStore } from '@/store'
  import FilterPopup from '@/components/filter-popup'

  const API = new Api()
  const useGlobal = useGlobalStore()

  console.log(useGlobal)

  /** 顶部状态栏高度 */
  const statusBarHeight = ref(0)
  const latitude = ref()
  const longitude = ref()
  const markers = ref()
  const visible = ref(true)

  const userInfoStorage = ref(getStorage(USER_INFO))

  /**
   * open id 登录
   */
  const loginOpenId = async (wx_open_id) => {
    const res = await API.loginOpenId({ wx_open_id })

    toast(res.message)

    if (res.code === 200) {
      setStorage(USER_INFO, res.data)
      userInfoStorage.value = res.data
    } else {
      uni.navigateTo({
        url: '/pages/login/index',
      })
    }
  }

  /**
   * 获取 open id
   */
  const getOpenId = async (code) => {
    const res = await API.getOpenId({ code })

    if (res.code === 200) {
      loginOpenId(res.data.openid)
    }
  }

  const wxLogin = async () => {
    const res = await uni.login()

    if (res.errMsg === 'login:ok') {
      getOpenId(res.code)
    }
  }

  /**
   * 设置顶部栏高度
   */
  const getStatusBarHeight = () => {
    const systemInfo = uni.getSystemInfoSync()

    statusBarHeight.value = systemInfo.statusBarHeight + 44
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

    /** 创建当前位置信息 */
    const result = await API.locationCreateRecord({
      latitude,
      longitude,
    })

    if (result.code === 200) {
      uni.navigateTo({
        url: '/pages/record-success/index',
      })
    }
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
  }

  /**
   * 跳转设置页面
   */
  const goSetting = () => {
    uni.navigateTo({
      url: '/pages/setting/index',
    })
  }

  /**
   * 跳转我的
   */
  const goMine = () => {
    uni.navigateTo({
      url: `/pages/mine/index?user_id=${userInfoStorage.value.user_info.user_id}`,
    })
  }

  const isLogin = () => {
    console.log(userInfoStorage.value)
    if (
      userInfoStorage &&
      userInfoStorage.value &&
      userInfoStorage.value.user_id
    ) {
      console.log('已经登录')
      // #ifdef MP-WEIXIN
      getStatusBarHeight() // 设置顶部栏高度
      // #endif
    } else {
      console.log('未登录')
      // uni.navigateTo({
      //   url: '/pages/login/index',
      // })
    }
  }

  /**
   * 跳转登录
   */
  const goLogin = () => {
    uni.navigateTo({
      url: '/pages/login/index',
    })
  }

  /**
   * 跳转朋友列表
   */
  const goFriends = () => {
    uni.navigateTo({
      url: '/pages/friends/index',
    })
  }

  /**
   *邀请朋友
   */
  const inviteFriends = () => {
    uni.navigateTo({
      url: '/pages/invite/index',
    })
  }

  /**
   * 排行榜
   */
  const goRanking = () => {
    uni.navigateTo({
      url: '/pages/ranking/index',
    })
  }

  /**
   * 获取邀请详情
   */
  const getFriendInviteInfo = async (invite_id) => {
    console.log('获取详情')
    const res = await API.getFriendInviteInfo({ invite_id })

    console.log(res)

    if (res.code === 200) {
      uni.showModal({
        title: '好友申请',
        content: `${res.data.name} 申请加你为好友，你同意吗？`,
        showCancel: true,
        cancelText: '拒绝',
        confirmText: '同意',
        success: async (res) => {
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
      })
    }
  }

  onLoad((options) => {
    if (options.invite_id) {
      getFriendInviteInfo(options.invite_id)
    }
  })

  onShow(() => {
    getLocation() // 获取位置信息
  })

  isLogin() // 是否登录

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
</script>

<template>
  <div class="home" :style="{ paddingTop: (statusBarHeight || 90) + 'px' }">
    <!-- 顶部模糊 -->
    <div class="header-gaussian" />

    <!-- 头像 -->
    <div class="avatar-wrapper" @click="goMine">
      <image
        mode="aspectFill"
        class="avatar-wrapper-image"
        src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="options-wrapper">
      <!-- 进入设置页面 -->
      <div class="options-button" @click="goSetting">
        <image class="options-setting-icon" src="/assets/svg/setting.svg" />
      </div>
      <div class="options-group">
        <!-- 地图设置 -->
        <div class="options-group-item">
          <image class="options-setting-icon" src="/assets/svg/map.svg" />
        </div>
        <div class="options-group-line" />
        <!-- 回到当前位置 -->
        <div class="options-group-item" @click="moveToCurrentLocation">
          <image class="options-setting-icon" src="/assets/svg/position.svg" />
        </div>
      </div>
    </div>

    <div class="demo">
      <button @click="wxLogin">登录</button>
      <button @click="goLogin">去登录</button>
    </div>

    <map
      v-if="latitude && longitude"
      id="map"
      class="map"
      show-location
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
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

    <!-- 底部卡片 -->
    <div class="footer">
      <div class="footer-group">
        <div
          class="footer-card footer-card-friends"
          style="
            --img: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-friends.png');
          "
          @click="goFriends"
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
          @click="inviteFriends"
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
          @click="goRanking"
        >
          <div class="footer-card-background">
            <div class="footer-card-title">排行榜</div>
            <div class="footer-card-content">Ranking</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部模糊 -->
    <!-- <div class="footer-gaussian" /> -->
  </div>

  <!-- 弹出层 -->
  <FilterPopup :visible="visible">
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
    <h1>dad</h1>
  </FilterPopup>
</template>

<style lang="scss">
  .demo {
    position: fixed;
    top: 200rpx;
    right: 0;
    left: 0;
    z-index: 40;
  }

  .home {
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;

    // 顶部高斯模糊
    .header-gaussian {
      width: 100vw;
      height: 260rpx;
      background: linear-gradient(
        180deg,
        #ffffff 20%,
        rgba(153, 153, 153, 0) 49%
      );
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9;
    }

    // 头像
    .avatar-wrapper {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      position: fixed;
      left: 32rpx;
      top: 138rpx;
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
      top: 194rpx;
      right: 32rpx;
      z-index: 20;
      display: flex;
      flex-direction: column;
      row-gap: 36rpx;

      // 设置
      .options-button {
        width: 84rpx;
        height: 84rpx;
        background: hsla(0, 0%, 100%, 0.2);
        -webkit-backdrop-filter: blur(25rpx);
        backdrop-filter: blur(25rpx);
        box-shadow: 0rpx 4rpx 23rpx 4rpx rgba(0, 0, 0, 0.25);
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
        background: hsla(0, 0%, 100%, 0.2);
        -webkit-backdrop-filter: blur(25rpx);
        backdrop-filter: blur(25rpx);
        box-shadow: 0rpx 4rpx 23rpx 4rpx rgba(0, 0, 0, 0.25);
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
            background: var(--img) no-repeat;
            background-size: cover;
            background-position: center;
          }

          // 模糊背景
          &::before {
            content: '';
            border-radius: 20rpx;
            position: absolute;
            inset: 0;
            top: 10rpx;
            z-index: -1;
            background: var(--img);
            background-size: cover;
            filter: blur(12rpx) brightness(1.1);
          }

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
      height: 420rpx;
      // background: linear-gradient(180deg, transparent, #fff 43%);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 20%,
        #ffffff 43%
      );
      // background-color: transparent;
      // background: hsla(0, 0%, 100%, 0.75);
      // -webkit-backdrop-filter: blur(5px);
      // backdrop-filter: blur(5px);
      // background: hsla(0, 0%, 100%, 0.2);
      -webkit-backdrop-filter: blur(25rpx);
      backdrop-filter: blur(25rpx);
      position: fixed;
      z-index: 9;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
</style>
