<script setup>
  import { Api } from '@/api'
  import { ref, nextTick } from 'vue'
  import { toast, getStorage, setStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { onLoad, onHide, onShow } from '@dcloudio/uni-app'

  const API = new Api()

  /** 顶部状态栏高度 */
  const statusBarHeight = ref(0)
  const latitude = ref()
  const longitude = ref()
  const markers = ref([])
  const showLocation = ref(false)

  // #ifdef MP-WEIXIN
  const capsuleStyle = uni.getMenuButtonBoundingClientRect()
  // #endif

  // #ifdef H5
  const capsuleStyle = {
    top: 58,
  }
  // #endif

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

    markers.value.push({
      id: 1,
      latitude: res.latitude,
      longitude: res.longitude,
      iconPath:
        'https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
      // iconPath: '/assets/images/image.png',
      width: 50,
      height: 50,
      // callout: {
      //   content: '我现在在这里',
      //   color: '#333',
      //   fontSize: 24,
      //   borderRadius: 30,
      //   bgColor: '#fff',
      //   padding: 20,
      // },
      // label: {
      //   content: '地点1',
      //   color: 'red',
      //   fontSize: 18,
      // },
    })
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
      url: `/pages/mine/index?user_id=${userInfoStorage.value.user_id}`,
    })
  }

  const isLogin = () => {
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
    // 监听陀螺仪数据变化事件
    // #ifdef MP-WEIXIN
    uni.onGyroscopeChange((res) => {
      // console.log('陀螺仪.x = ' + res.x)
      // console.log('陀螺仪.y = ' + res.y)
      // console.log('陀螺仪.z = ' + res.z)
    })

    // 开始监听陀螺仪数据
    uni.startGyroscope({
      interval: 'normal',
      success() {
        console.log('success')
      },
      fail() {
        console.log('fail')
      },
    })
    // #endif
  })

  onHide(() => {
    // #ifdef MP-WEIXIN
    uni.stopGyroscope({
      success() {
        console.log('stop success!')
      },
      fail() {
        console.log('stop fail!')
      },
    })
    // #endif
  })

  // onShow(() => {
  //   getClipboardData() // 读取剪贴板
  // })

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
    <!-- 头部 -->
    <div class="header">
      <div class="header-left" @click="goMine">
        <image
          class="header-left-avatar"
          src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
        />
      </div>

      <div class="hader-right" @click="goSetting">
        <i class="city-icon icon-ego-menu" />
      </div>
    </div>

    <div @click="wxLogin">登录</div>
    <div @click="goLogin">去登录</div>

    <map
      v-if="latitude && longitude"
      id="map"
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :show-location="showLocation"
      @markertap="markertap"
      @tap="mapTap"
      @poitap="poitap"
      @regionchange="regionchange"
    />

    <!-- 底部卡片 -->
    <div class="footer">
      <div class="footer-item" @click="goFriends">我的朋友</div>
      <div class="footer-item" @click="onRecord">打卡</div>
      <div class="footer-item" @click="inviteFriends">邀请朋友</div>
      <div class="footer-item" @click="goRanking">排行榜</div>
      <div class="footer-item" @click="moveToCurrentLocation">回到当前位置</div>
    </div>
  </div>
</template>

<style lang="scss">
  .home {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;

    // 头部
    .header {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      position: relative;
      z-index: 20;

      .header-left-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .hader-right {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        .city-icon {
          font-size: 22px;
        }
      }
    }

    .map {
      width: 100vw;
      height: 100vh;
      position: fixed;
      inset: 0;
    }

    .footer {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 20px;
      column-gap: 20px;
      position: fixed;
      bottom: 40px;
      right: 0;
      left: 0;
      padding: 0 32px;
      box-sizing: border-box;

      .footer-item {
        height: 80px;
        padding: 15px;
        box-sizing: border-box;
        background: skyblue;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
