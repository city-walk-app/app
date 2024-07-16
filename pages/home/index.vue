<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  import { toast, getStorage, setStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { onLoad, onHide, onShow } from '@dcloudio/uni-app'

  const API = new Api()

  /** 顶部状态栏高度 */
  const statusBarHeight = ref(0)
  const latitude = ref(39.909)
  const longitude = ref(116.39742)
  const markers = ref([])

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

    //加偏移
    const x = res.latitude
    const y = res.longitude
    const x_pi = (3.14159265358979324 * 3000.0) / 180.0
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
    const lngs = z * Math.cos(theta) + 0.0065
    const lats = z * Math.sin(theta) + 0.006

    console.log(lats, lats)

    longitude.value = lngs
    latitude.value = lats

    markers.value.push({
      id: 1,
      longitude: lngs,
      latitude: lats,
      iconPath:
        'https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
      width: 50,
      height: 50,
      callout: {
        content: '我现在在这里',
        color: 'blue',
        fontSize: 24,
        borderRadius: 30,
        bgColor: '#fff',
        padding: 20,
      },
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
      getLocation() // 获取位置信息
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

    <!-- layer-style="c29e758aea2d2a1873049aeb81dab986" -->
    <!-- layer-style="e80910a0ee8d19937315ea3a22496777" -->
    <!-- enable-satellite -->
    <map
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      show-location
    />

    <!-- 底部卡片 -->
    <div class="footer">
      <div class="footer-item" @click="goFriends">我的朋友</div>
      <div class="footer-item" @click="onRecord">打卡</div>
      <div class="footer-item" @click="inviteFriends">邀请朋友</div>
      <div class="footer-item" @click="goRanking">排行榜</div>
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
