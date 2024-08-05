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
    isNumber,
    isArray,
    previewImage,
  } from '@/utils'
  import { USER_INFO, USER_TOKEN, DEFAULT_AVATAR } from '@/enum'
  import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
  import { useGlobalStore } from '@/store'
  import FilterPopup from '@/components/filter-popup'
  import Sheet from '@/components/sheet'
  import CwButton from '@/components/cw-button'

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
  const enableSatellite = ref(false)
  /** 是否显示对话框 */
  const visibleSheet = ref(false)
  /** 打开信息详情 */
  const recordDetail = ref()
  /** 天气信息 */
  const weatherInfo = ref()
  /** 心情颜色 */
  const moodColors = ref([
    {
      color: '#f16a59',
      borderColor: '#ef442f',
      key: 'EXCITED',
      type: '兴奋的',
    },
    {
      color: '#f6a552',
      borderColor: '#f39026',
      key: 'ENTHUSIASTIC',
      type: '热情的',
    },
    {
      color: '#fad35c',
      borderColor: '#fac736',
      key: 'HAPPY',
      type: '快乐的',
    },
    {
      color: '#74cd6d',
      borderColor: '#50c348',
      key: 'RELAXED',
      type: '放松的',
    },
    {
      color: '#4a8cf9',
      borderColor: '#1d6ff8',
      key: 'CALM',
      type: '平静的',
    },
    {
      color: '#af72dc',
      borderColor: '#9b4fd3',
      key: 'MYSTERIOUS',
      type: '神秘的',
    },
    {
      color: '#9b9ca0',
      borderColor: '#838387',
      key: 'NEUTRAL',
      type: '中性的',
    },
  ])
  /** 出行方式 */
  const travelType = ref([
    { icon: '', key: 'WALKING', type: '步行' },
    { icon: '', key: 'BICYCLE', type: '自行车' },
    { icon: '', key: 'CAR', type: '自驾' },
    { icon: '', key: 'BUS', type: '公交' },
    { icon: '', key: 'METRO', type: '地铁' },
    { icon: '', key: 'TRAIN', type: '火车' },
    { icon: '', key: 'AIRPLANE', type: '飞机' },
    { icon: '', key: 'SHIP', type: '船' },
  ])
  /** 步行记录详情表单 */
  const routeDetailForm = reactive({
    route_id: '', // 步行 id
    content: '', // 内容
    travel_type: '', // 出行方式
    mood_color: '', // 心情颜色
    address: '电话的哈等哈', // 位置信息
    picture: [], // 照片
  })
  /** 选择的图片 */
  const pictureFileList = ref()
  /** 最多上传的图片 */
  const maxPictureCount = ref(2)
  /** 心情颜色配置 */
  const moodColorOptions = ref()
  /** 邀请 id */
  const inviteId = ref()
  /** 键盘高度 */
  const keyboardHeight = ref(0)

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
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (!userInfoStorage.value.user_id) {
      return
    }

    try {
      const res = await API.getUserInfo({
        user_id: userInfoStorage.value.user_id,
      })

      if (res.code === 200) {
        userInfoStorage.value = res.data
        setStorage(USER_INFO, res.data)
      }
    } catch (err) {
      console.log('获取用户信息异常', err)
    }
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
   * open id 登录失败
   */
  const openIdLoginErr = () => {
    toast('快捷登陆失败')
    setTimeout(emailLogin, 500)
  }

  /**
   * open id 登录
   */
  const loginOpenId = async (wx_open_id) => {
    try {
      const res = await API.loginOpenId({ wx_open_id })

      toast(res.message)

      if (res.code === 200) {
        userInfoStorage.value = res.data.user_info
        userTokenStorage.value = res.data.token

        setStorage(USER_INFO, res.data.user_info)
        setStorage(USER_TOKEN, res.data.token)

        // 是否存在邀请
        if (inviteId.value) {
          getFriendInviteInfo(inviteId.value) // 获取邀请详情
        }
      }
    } catch (err) {
      console.log('open id 登录异常', err)
      openIdLoginErr() // open id 登录失败
    }
  }

  /**
   * 获取 open id
   */
  const getOpenId = async (code) => {
    try {
      const res = await API.getOpenId({ code })

      if (res.code === 200) {
        loginOpenId(res.data.openid)
        getLocation() // 获取位置信息
      }
    } catch (err) {
      console.log('获取 open id 异常', err)
      openIdLoginErr() // open id 登录失败
    }
  }

  /**
   * 微信登录
   */
  const wxLogin = async () => {
    try {
      const res = await uni.login()

      if (res.errMsg === 'login:ok') {
        getOpenId(res.code) // 获取 open id
      }
    } catch (err) {
      console.log('微信登录异常', err)
      openIdLoginErr() // open id 登录失败
    }
  }

  /**
   * 关闭对话框
   */
  const closeSheet = () => {
    visibleSheet.value = false
    recordDetail.value = null
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
    try {
      const res = await uni.chooseLocation({ type: 'gcj02' })

      if (res.errMsg !== 'chooseLocation:ok') {
        toast('查看位置错误')
        return
      }

      const { latitude, longitude, name, address } = res

      if (!isNumber(longitude) || !isNumber(latitude)) {
        toast('打卡失败')
        return
      }

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
    } catch (err) {
      console.log('接口异常', err)
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
    try {
      const res = await API.getLocationPopularRecommend({
        longitude: longitude.value,
        latitude: latitude.value,
      })

      if (res.code === 200) {
        if (isArray(res.data) && res.data.length) {
          setMarkers(res.data) // 设置地图标点
        }
        return
      }

      toast(res.message)
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 获取当前地区的天气
   */
  const getWeatherInfo = async () => {
    try {
      const res = await API.getWeatherInfo({
        longitude: longitude.value,
        latitude: latitude.value,
      })

      if (res.code === 200) {
        weatherInfo.value = res.data
        return
      }

      toast(res.message)
    } catch (err) {
      console.log('获取当前地区的天气接口异常', err)
    }
  }

  /**
   * 获取位置信息
   */
  const getLocation = async () => {
    try {
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

      if (isNumber(res.longitude) && isNumber(res.latitude)) {
        longitude.value = res.longitude
        latitude.value = res.latitude

        // getLocationPopularRecommend() // 获取周边热门地点
        // getWeatherInfo() // 获取天气信息
      }
    } catch (err) {
      console.log('获取位置信息异常', err)
    }
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
  const setStorageData = () => {
    userInfoStorage.value = getStorage(USER_INFO)
    userTokenStorage.value = getStorage(USER_TOKEN)
  }

  /**
   * 同意好友邀请
   */
  const friendConfirmInvite = async (invite_id) => {
    if (!invite_id) {
      return
    }

    try {
      showLoading()

      const res = await API.friendConfirmInvite({ invite_id })

      hideLoading()

      if (res.code === 200) {
        console.log(result)
        inviteId.value = null
        toast('添加成功')
      }
    } catch (err) {
      console.log('同意好友邀请接口异常', err)
      hideLoading()
    }
  }

  /**
   * 获取邀请详情
   */
  const getFriendInviteInfo = async (invite_id) => {
    try {
      const res = await API.getFriendInviteInfo({ invite_id })

      console.log(res)

      if (res.code === 200) {
        const modalRes = await uni.showModal({
          title: '好友申请',
          content: `${res.data.name || ''} 申请加你为好友，你同意吗？`,
          showCancel: true,
          cancelText: '拒绝',
          confirmText: '同意',
        })

        if (modalRes.errMsg !== 'showModal:ok') {
          toast('弹窗异常')
          return
        }

        // 同意好友邀请
        if (modalRes.confirm) {
          friendConfirmInvite(invite_id) // 同意好友邀请
        }
      }
    } catch (err) {
      console.log('异常', err)
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
  const moveToCurrentLocation = () => {
    try {
      const mapContext = uni.createMapContext('map')

      mapContext.moveToLocation()
    } catch (err) {
      console.log('回到当前位置异常', err)
    }
  }

  /**
   * 完善步行打卡记录详情
   */
  const submitRouteDetail = async () => {
    try {
      showLoading()

      // 上传图片
      if (isArray(pictureFileList.value) && pictureFileList.value.length) {
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
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 选择照片替换
   */
  const choosePictureReplace = async (index) => {
    if (!isNumber(index)) {
      return
    }

    try {
      const res = await uni.chooseImage({
        count: 1, // 选择图片的数量
        sourceType: ['album', 'camera'],
      })

      if (res.errMsg === 'chooseImage:ok') {
        if (pictureFileList.value[index]) {
          pictureFileList.value[index] = res.tempFilePaths[0]
        }
      }
    } catch (err) {
      console.log('替换图片异常', err)
    }
  }

  /**
   * 选择照片
   */
  const choosePicture = async () => {
    if (pictureFileList.length === maxPictureCount.value) {
      return
    }

    try {
      const length = pictureFileList.length || 0

      const res = await uni.chooseImage({
        count: maxPictureCount.value - length, // 选择图片的数量
        sourceType: ['album', 'camera'],
      })

      if (res.errMsg === 'chooseImage:ok') {
        pictureFileList.value = [
          ...(pictureFileList.value || []),
          ...res.tempFilePaths,
        ]

        console.log(pictureFileList.value)
      }
    } catch (err) {
      console.log('选择照片异常', err)
    }
  }

  /**
   * 获取权限
   */
  const getSetting = async () => {
    try {
      const settingRes = await uni.getSetting()

      console.log('获取权限', settingRes)

      if (settingRes.errMsg !== 'getSetting:ok') {
        return
      }

      // 不是已授权位置权限状态
      if (!settingRes.authSetting['scope.userLocation']) {
        const modalRes = await uni.showModal({
          title: '位置权限',
          content: '当前暂未开启位置权限，避免影响功能正常使用，你要去开启吗？',
          showCancel: true,
          cancelText: '先不了',
          confirmText: '去开启',
        })

        if (modalRes.errMsg !== 'showModal:ok') {
          return
        }

        if (modalRes.confirm) {
          const openRes = await uni.openSetting()

          if (openRes.errMsg !== 'openSetting:ok') {
            return
          }

          // 已经授权了
          if (openRes.authSetting['scope.userLocation']) {
            getLocation() // 获取位置信息
          }
        }

        return
      }

      getLocation() // 获取位置信息
    } catch (err) {
      console.log('获取权限异常', err)
    }
  }

  /**
   * 长按图片操作
   */
  const handleLongPictureOpt = async (index) => {
    try {
      const res = await uni.showActionSheet({
        itemList: ['替换照片', '删除'],
      })

      if (res.errMsg !== 'showActionSheet:ok') {
        return
      }

      // 替换照片
      if (res.tapIndex === 0) {
        choosePictureReplace(index) // 替换照片
      }
      // 删除
      else if (res.tapIndex === 1) {
        if (pictureFileList.value[index]) {
          pictureFileList.value.splice(index, 1)
        }
      }

      console.log(res)
    } catch (err) {
      console.log('长按图片操作异常', err)
    }
  }

  /**
   * 选择心情颜色
   */
  const selectMoodColors = (item) => {
    if (routeDetailForm.mood_color === item.key) {
      routeDetailForm.mood_color = ''
      moodColorOptions.value = null
    } else {
      routeDetailForm.mood_color = item.key
      moodColorOptions.value = item
    }

    console.log(routeDetailForm.mood_color)
  }

  /**
   * 邮箱登录
   */
  const emailLogin = () => {
    console.log('邮箱登录', inviteId.value)
    if (inviteId.value) {
      uni.navigateTo({
        url: `/pages/login/index?invite_id=${inviteId.value}`,
      })
      return
    }

    uni.navigateTo({ url: '/pages/login/index' })
  }

  /**
   * 取消完善打卡信息
   */
  const cancellation = () => {
    visibleSheet.value = false
  }

  /**
   * 点击预览图片
   */
  const previewPicture = async (urls, current) => {
    await previewImage(urls, current)
  }

  /**
   * 键盘高度变化执行的回调
   */
  const handleKeyboardHeightChange = (evt) => {
    keyboardHeight.value = evt.height
    console.log('键盘', evt.height)
  }

  onLoad((options) => {
    console.log('启动参数', options)

    // 如果是登录状态
    if (isLoginState.value) {
      // 存在邀请 id
      if (options.invite_id) {
        getFriendInviteInfo(options.invite_id) // 获取邀请详情
      }

      getUserInfo() // 获取用户信息
      // #ifdef MP-WEIXIN
      uni.onKeyboardHeightChange(handleKeyboardHeightChange) // 监听键盘高度变化事件
      // #endif
      return
    }

    inviteId.value = options.invite_id
  })

  onUnload(() => {
    // #ifdef MP-WEIXIN
    uni.offKeyboardHeightChange(handleKeyboardHeightChange) // 移除键盘高度变化事件监听
    // #endif
  })

  onShow(() => {
    setStorageData() // 设置缓存信息

    if (isLoginState.value) {
      // #ifdef MP-WEIXIN
      getSetting() // 获取权限
      // #endif
    }
  })
</script>

<template>
  <Sheet
    v-model:visible="visibleSheet"
    :bottom="keyboardHeight"
    @on-close="closeSheet"
  >
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
          :src="userInfoStorage.avatar || DEFAULT_AVATAR"
        />
      </div>

      <!-- 操作按钮 -->
      <div
        class="options-wrapper"
        :style="{
          '--top': useGlobal.navBarHeight + 16 + 'px',
          '--background': 'rgba(255, 255, 255, 0.2)',
          '--border-color': 'rgba(255, 255, 255, 0.3)',
        }"
      >
        <!-- 进入设置页面 -->
        <div class="options-button" @click="goPage('/pages/setting/index')">
          <image class="options-setting-icon" src="/assets/svg/setting.svg" />
        </div>

        <!-- 操作组 -->
        <div class="options-group">
          <!-- 改变地图图层 -->
          <div class="options-group-item" @click="changeEnableSatellite">
            <image
              v-if="enableSatellite"
              class="options-setting-icon"
              src="/assets/svg/home-star-map-open.svg"
            />
            <image
              v-else
              class="options-setting-icon"
              src="/assets/svg/home-star-map-close.svg"
            />
          </div>
          <div class="options-group-line" />
          <!-- 回到当前位置 -->
          <div class="options-group-item" @click="moveToCurrentLocation">
            <image
              class="options-setting-icon"
              src="/assets/svg/home-position.svg"
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
        <div v-if="recordDetail.province_url" class="home-sheet-jigsaw">
          <div
            class="home-sheet-jigsaw-image"
            :style="{
              '--province': `url('${recordDetail.province_url}')`,
              '--background': recordDetail.background_color,
            }"
          />
        </div>

        <!-- 文案 -->
        <div class="home-sheet-content" v-if="recordDetail.province_url">
          再获得100经验版图将会升温版图 {{ keyboardHeight + 'px' }}
        </div>

        <!-- 内容部分 -->
        <div class="home-sheet-content-body">
          <!-- 图片容器 -->
          <div class="home-sheet-content-body-picture-wrapper">
            <!-- 如果有一张图片的时候 -->
            <template
              v-if="isArray(pictureFileList) && pictureFileList.length === 1"
            >
              <div class="home-sheet-content-body-picture-wrapper-list">
                <!-- 图片 -->
                <div
                  class="home-sheet-content-body-picture-wrapper-item"
                  @longpress="handleLongPictureOpt(0)"
                  @click="previewPicture(pictureFileList, pictureFileList[0])"
                >
                  <div class="home-sheet-content-body-picture-wrapper-item-box">
                    <image
                      class="home-sheet-content-body-picture-wrapper-item-image"
                      mode="aspectFill"
                      :src="pictureFileList[0]"
                    />
                  </div>
                </div>

                <!-- 未上传的 -->
                <div
                  class="home-sheet-content-body-picture-wrapper-item"
                  @click="choosePicture"
                >
                  <!-- 空的未上传的 -->
                  <div
                    class="home-sheet-content-body-picture-wrapper-item-box-empty"
                  >
                    <!-- 照相机 -->
                    <div class="home-sheet-content-body-camera-wrapper">
                      <image
                        class="home-sheet-content-body-camera"
                        src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/record-succese-camera.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 如果有两张图片的时候 -->
            <template
              v-else-if="
                isArray(pictureFileList) && pictureFileList.length === 2
              "
            >
              <div class="home-sheet-content-body-picture-wrapper-list">
                <!-- 图片 -->
                <div
                  class="home-sheet-content-body-picture-wrapper-item"
                  v-for="(item, index) in pictureFileList"
                  :key="index"
                  @longpress="handleLongPictureOpt(index)"
                  @click="
                    previewPicture(pictureFileList, pictureFileList[index])
                  "
                >
                  <div class="home-sheet-content-body-picture-wrapper-item-box">
                    <image
                      class="home-sheet-content-body-picture-wrapper-item-image"
                      mode="aspectFill"
                      :src="item"
                    />
                  </div>
                </div>
              </div>
            </template>

            <!-- 没有选择图片的时候 -->
            <template v-else>
              <!-- 照相机 -->
              <div
                class="home-sheet-content-body-camera-wrapper"
                @click="choosePicture"
              >
                <image
                  class="home-sheet-content-body-camera"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/record-succese-camera.png"
                />
              </div>

              <!-- 发布瞬间按钮 -->
              <CwButton
                width="320rpx"
                height="80rpx"
                radius="16rpx"
                class="home-sheet-content-body-button"
                @click="choosePicture"
              >
                发布瞬间
              </CwButton>
            </template>
          </div>

          <!-- 心情颜色 -->
          <div class="home-sheet-content-body-mood-colors">
            <div
              v-for="(item, index) in moodColors"
              :class="[
                'home-sheet-content-body-color',
                {
                  'home-sheet-content-body-color-not':
                    routeDetailForm.mood_color &&
                    item.key !== routeDetailForm.mood_color,
                },
              ]"
              :key="index"
              :style="{
                '--background': item.color,
                '--border-color': item.borderColor,
              }"
              @click="selectMoodColors(item)"
            />

            <div
              v-if="routeDetailForm.mood_color && moodColorOptions"
              class="home-sheet-content-body-color-title"
              :style="{
                '--color': moodColorOptions.color,
              }"
            >
              {{ moodColorOptions.type }}
            </div>
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
            <textarea
              v-model="routeDetailForm.content"
              class="home-sheet-content-body-speak-text-textarea"
              placeholder="说点什么？"
              auto-height
              placeholder-class="home-sheet-content-body-speak-text-textarea-placeholder"
              :maxlength="140"
              :adjust-position="false"
              :show-confirm-bar="false"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="home-sheet-content-footer">
          <CwButton type="line" @click="cancellation">取消</CwButton>
          <CwButton @click="submitRouteDetail">就这样</CwButton>
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
        <CwButton type="line" @click="emailLogin">邮箱登录</CwButton>
        <CwButton @click="wxLogin">快捷登录</CwButton>
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
      background-color: var(--cw-skeleton-background-light);
      z-index: 20;
      box-shadow: 0rpx 4rpx 12rpx 4rpx rgba(0, 0, 0, 0.16);

      .avatar-wrapper-image {
        width: inherit;
        height: inherit;
        border-radius: inherit;
        flex-shrink: 0;
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
        box-shadow: 0rpx 4rpx 12rpx 4rpx rgba(0, 0, 0, 0.16);

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
        box-shadow: 0rpx 4rpx 12rpx 4rpx rgba(0, 0, 0, 0.16);

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
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(15rpx);
        box-shadow: 0rpx 4rpx 12rpx 4rpx rgba(0, 0, 0, 0.16);
        border-radius: 50%;
        border: 2rpx solid #fff;
        backdrop-filter: blur(15rpx);
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
        border: 2rpx solid #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 20rpx;
        color: #fff;
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

          // 主题
          .footer-card-title {
            font-weight: bold;
            font-size: 32rpx;
            color: #fff;
            line-height: 38rpx;
          }

          // 内容
          .footer-card-content {
            font-weight: 400;
            font-size: 24rpx;
            color: #fff;
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
    overflow-y: auto;

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
      border-radius: 44rpx;
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

      // 图片容器-没有选择图片的时候
      .home-sheet-content-body-picture-wrapper {
        width: 100%;
        height: 282rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #fff 100%);
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
        }
      }

      // 图片容器-选择了图片之后
      .home-sheet-content-body-picture-wrapper-list {
        width: inherit;
        height: inherit;
        display: flex;
        align-items: stretch;

        // 左右两项
        .home-sheet-content-body-picture-wrapper-item {
          flex: 1;
          flex-shrink: 0;
          padding: 15rpx;
          box-sizing: border-box;
          display: flex;
          position: relative;

          // 图片容器
          .home-sheet-content-body-picture-wrapper-item-box {
            flex: 1;
            display: flex;
            flex-shrink: 0;
            background-color: var(--cw-skeleton-background-light);
            border-radius: 28rpx;
            position: relative;
            overflow: hidden;

            // 图片元素
            .home-sheet-content-body-picture-wrapper-item-image {
              flex: 1;
              display: flex;
              width: inherit;
              height: inherit;
              flex-shrink: 0;
            }
          }

          // 空的图片容器
          .home-sheet-content-body-picture-wrapper-item-box-empty {
            flex: 1;
            flex-shrink: 0;
            border-radius: 28rpx;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      // 心情颜色
      .home-sheet-content-body-mood-colors {
        display: flex;
        align-items: center;
        margin-top: 32rpx;
        // justify-content: space-between;
        flex-wrap: nowrap;
        column-gap: 12rpx;

        // 主题
        .home-sheet-content-body-color-title {
          font-weight: 400;
          font-size: 32rpx;
          line-height: 38rpx;
          color: var(--color);
        }

        .home-sheet-content-body-color {
          width: 74rpx;
          height: 74rpx;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2rpx solid var(--border-color);
          background-color: var(--background);
          transition: opacity 0.25s;
          opacity: 1;

          // 未选中的
          &.home-sheet-content-body-color-not {
            // opacity: 0.3;
            display: none;
          }
        }
      }

      // 位置
      .home-sheet-content-body-position {
        width: 100%;
        height: 96rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #fff 100%);
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
        padding: 26rpx 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        // 地点文案
        .home-sheet-content-body-position-text {
          font-weight: 400;
          font-size: 32rpx;
          color: #666666;
          line-height: 38rpx;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      // 说点什么
      .home-sheet-content-body-speak {
        width: 100%;
        min-height: 124rpx;
        background: linear-gradient(135deg, #fff2d1 0%, #fff 100%);
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
        margin-top: 32rpx;
        padding: 26rpx 32rpx;
        box-sizing: border-box;

        // 占位文字
        .home-sheet-content-body-speak-text-textarea-placeholder {
          font-weight: 500;
          font-size: 36rpx;
          color: #a8a8a8;
          line-height: 42rpx;
        }

        // 输入框
        .home-sheet-content-body-speak-text-textarea {
          width: 100%;
          background-color: transparent;
          border: none;
          font-weight: 500;
          font-size: 36rpx;
          color: #666;
          line-height: 42rpx;
        }
      }
    }

    // 底部操作
    .home-sheet-content-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 46rpx;
    }
  }
</style>
