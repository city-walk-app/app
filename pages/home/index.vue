<script setup>
  import { Api } from '@/api'
  import { ref, inject, onMounted, nextTick } from 'vue'
  import {
    VUE_APP_API_URL,
    usePositioning,
    toast,
    setStorage,
    getStorage,
  } from '@/utils'
  import { USER_PROVINCE_CODE } from '@/enum'
  import echarts from '@/utils/echarts'
  import lChart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
  import CityDialog from '@/components/city-dialog/index.vue'

  const API = new Api()

  const { getAround } = usePositioning()

  /** 当前省份信息缓存 */
  const provinceInfo = ref(getStorage(USER_PROVINCE_CODE))
  /** 地图容器组件 DOM */
  const mapWrapperRef = ref()
  /** 经验列表 */
  const experienceList = ref()
  /** 解锁新的省份 */
  const newPprovince = ref()
  /** 对话框展示状态 */
  const visible = ref(false)
  /** 顶部状态栏高度 */
  const statusBarHeight = ref(0)

  // #ifdef MP-WEIXIN
  const capsuleStyle = uni.getMenuButtonBoundingClientRect()
  // #endif

  // #ifdef H5
  const capsuleStyle = {
    top: 58,
  }
  // #endif

  const userInfoStorage = inject('userInfoStorage')

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
  const onRecord = getAround(async (res) => {
    const { address, latitude, longitude, name } = res

    const result = await API.createPositionRecord({
      address,
      latitude,
      longitude,
      name,
    })

    toast(result.message)

    if (result.code === 200) {
      // 判断是否解锁新的省份
      if (result.data.new_province) {
        visible.value = true
        newPprovince.value = result.data.new_province
      }

      getLocation() // 获取位置信息
    }
  })

  /**
   * 获取经验列表
   */
  const getExperience = async () => {
    const res = await API.getExperience({
      province_code: provinceInfo.value.province_code,
    })

    if (res.code === 200) {
      experienceList.value = res.data
    }
  }

  /**
   * 获取位置信息
   */
  const getLocation = () => {
    // renderMap() // 渲染地图
    uni.getLocation({
      type: 'wgs84',
      success: async (res) => {
        console.log('获取用户位置信息成功:', res)
        const { longitude, latitude } = res

        const result = await API.getLocationInfo({
          longitude,
          latitude,
        })

        if (result.code === 200) {
          result.data.province_banner = `${VUE_APP_API_URL}/images/province/${result.data.province_code}.png`

          provinceInfo.value = result.data

          // 设置位置信息本地存储
          setStorage(USER_PROVINCE_CODE, result.data)

          getExperience() // 获取经验列表
          renderMap() // 渲染地图
        }
      },
      fail: (res) => {
        console.log('获取用户位置信息失败:', res)
      },
    })
  }

  /**
   * 获取地图数据
   */
  const getMapData = async () => {
    const res = await API.getMapData({
      code: provinceInfo.value.province_code,
      // code: 330000,
    })

    if (res.code === 200) {
      return res.data
    }

    return []
  }

  /**
   * 渲染地图
   */
  const renderMap = async () => {
    await nextTick()

    // 开始渲染图表
    mapWrapperRef.value.init(echarts, async (chart) => {
      chart.showLoading()

      /** 获取地图数据 */
      const mapdata = await getMapData()

      echarts.registerMap('CHINA_MAP', mapdata)

      chart.hideLoading()

      // https://echarts.apache.org/examples/zh/editor.html?c=doc-example/map-visualMap-continuous-text&edit=1&reset=1
      const option = {
        series: [
          {
            name: '中国地图',
            type: 'map',
            map: 'CHINA_MAP',
            itemStyle: {
              borderColor: 'none',
              areaColor: 'lightskyblue',
            },
            data: [
              {
                name: provinceInfo.value.province,
                value: 2000,
              },
            ],
          },
        ],
      }

      chart.setOption(option)
    })
  }

  /**
   * 点击经验进行收集
   */
  const collectExperience = async (id, index) => {
    const res = await API.collectExperience({
      id,
    })

    experienceList.value[index].collecting = true

    if (res.code === 200) {
      getLocation() // 获取位置信息
    }
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
   * 关闭对话框
   */
  const ok = () => {
    visible.value = false
  }

  const isLogin = () => {
    console.log(userInfoStorage.value)
    if (userInfoStorage.value && userInfoStorage.value.id) {
      // #ifdef MP-WEIXIN
      getStatusBarHeight() // 设置顶部栏高度
      // #endif
      getLocation() // 获取位置信息
    }
  }

  // onMounted(() => {
  //   renderMap() // 渲染地图
  // })

  isLogin()

  /**
   * 跳转足迹记录
   */
  const onFootprint = () => {
    uni.navigateTo({
      url: '/pages/footprint/index',
    })
  }

  /**
   * 跳转赞助
   */
  const goSupporter = () => {
    uni.navigateTo({
      url: '/pages/supporter/index',
    })
  }
</script>

<template>
  <div class="home" :style="{ paddingTop: (statusBarHeight || 90) + 'px' }">
    <!-- 地图 -->
    <div class="home-map">
      <lChart ref="mapWrapperRef" />
    </div>

    <!-- 头部 -->
    <div class="header">
      <div class="hader-right" @click="goSetting">
        <i class="city-icon icon-ego-menu" />
      </div>
    </div>

    <!-- 身份部分 -->
    <div class="body">
      <div class="province-banner-wrapper">
        <!-- 经验盒子 -->
        <div class="experience-wrapper">
          <!-- 经验列表 -->
          <div
            :class="[
              'experience-item',
              { 'experience-item-collecting': item.collecting },
            ]"
            v-for="(item, index) in experienceList"
            :key="index"
            @click="collectExperience(item.id, index)"
          >
            <div class="experience-title">经验</div>
            <div class="experience-value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <!-- 临时功能入口 -->
      <div class="footer">
        <div class="footer-item" @click="onRecord">地点打卡</div>
        <div class="footer-item" @click="onFootprint">解锁记录</div>
        <div class="footer-item" @click="goSupporter">赞助</div>
      </div>
    </div>
  </div>

  <!-- 对话框 -->
  <CityDialog :visible="visible">
    <div v-if="newPprovince" class="dialog-box">
      <div>恭喜你解锁 {{ newPprovince.province_name }}</div>
      <image
        class="dialog-banner"
        :src="`${VUE_APP_API_URL}/images/province/${newPprovince.province_code}.png`"
      />
      <button @click="ok">确定</button>
    </div>
  </CityDialog>
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

    .home-map {
      width: 80vw;
      height: 80vw;
      position: absolute;
      right: 0;
      top: 0;
      left: 0;
      bottom: 0;
      margin: auto;
    }

    // 头部
    .header {
      width: 100%;
      height: 50px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      padding: 0 10px;

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

    // 身体
    .body {
      width: 100%;
      flex: 1;
      flex-shrink: 0;
      padding-bottom: 150px;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      // 省份版图
      .province-banner-wrapper {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        flex-direction: column;

        // 经验数量
        .province-value {
          font-size: 15px;
          color: #111;
          margin-top: 10px;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(20px);
          }

          100% {
            transform: translateY(0);
          }
        }

        // 经验容器
        .experience-wrapper {
          position: absolute;
          inset: 0;
          // animation: float 2s ease-in-out infinite;

          // 经验
          .experience-item {
            position: absolute;
            width: 70px;
            height: 70px;
            background-color: #39e3a7;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
            transition: 1s;

            &.experience-item-collecting {
              transform: translate(-50%, -50%) scale(0) !important;
              opacity: 0;
            }
          }

          .experience-item:nth-child(1) {
            transform: translate(-217%, -252%);
          }

          .experience-item:nth-child(2) {
            transform: translate(-57%, -282%);
          }

          .experience-item:nth-child(3) {
            transform: translate(157%, -252%);
          }
        }
      }
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 13px;

      .footer-item {
        padding: 15px;
        box-sizing: border-box;
        flex-shrink: 0;
        color: #fff;
        background-color: #5ee0dd;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: bold;
        font-family: PingFangSC-Regular;
      }
    }
  }

  // 对话框
  .dialog-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;

    .dialog-banner {
      width: 200px;
      height: 200px;
      object-fit: cover;
    }
  }
</style>
