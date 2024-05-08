<script setup>
  import echarts from '@/utils/echarts'
  import lChart from '@/uni_modules/lime-echart/components/l-echart/l-echart.vue'
  import { ref, onMounted } from 'vue'
  import { Api } from '@/api'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'

  const API = new Api()

  /** 缓存的当前用户信息 */
  const userInfoStorage = getStorage(USER_INFO)
  /** 记录触摸起始位置 */
  let startY = 0
  /** 当前用户走过的省份列表 */
  const provinceList = ref([])
  /** 容器高度 */
  const containerSize = ref(300)
  /** y 轴是否可以滚动 */
  const scrollY = ref(false)
  /** 地图容器组件 DOM */
  const mapWrapperRef = ref()

  /**
   * 获取当前用户走过的省份列表
   */
  const getUserProvince = async () => {
    const res = await API.getUserProvince({ id: userInfoStorage.id })

    if (res.code === 200) {
      provinceList.value = res.data
      return res.data
    }

    return []
  }

  /**
   * 开始滑动触发
   */
  const startDrag = (evt) => {
    startY = evt.touches[0].clientY
  }

  /**
   * 滑动触发
   */
  const handleTouchMove = (evt) => {
    const currentY = evt.touches[0].clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      containerSize.value = 300
      scrollY.value = false
    } else {
      containerSize.value = 700
      scrollY.value = true
    }
  }

  /**
   * 获取地图数据
   */
  const getMapData = async () => {
    const res = await API.getMapData()

    if (res.code === 200) {
      return res.data
    }

    return []
  }

  /**
   * 渲染地图
   */
  const renderMap = async () => {
    // 开始渲染图表
    mapWrapperRef.value.init(echarts, async (chart) => {
      chart.showLoading()

      /** 获取地图数据 */
      const mapdata = await getMapData()

      echarts.registerMap('CHINA_MAP', mapdata)

      const cityList = await getUserProvince() // 获取当前用户走过的省份列表

      chart.hideLoading()

      // https://echarts.apache.org/examples/zh/editor.html?c=doc-example/map-visualMap-continuous-text&edit=1&reset=1
      const option = {
        visualMap: {
          min: 800,
          max: 50000,
          show: false,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered'],
          },
        },
        series: [
          {
            name: '中国地图',
            type: 'map',
            map: 'CHINA_MAP',
            itemStyle: {
              borderColor: 'rgba(0, 0, 0, 0.5)',
            },
            data: cityList.map((item) => {
              return {
                name: item.province_name,
                value: 2000,
              }
            }),
          },
        ],
      }

      chart.setOption(option)
    })
  }

  onMounted(renderMap)
</script>

<template>
  <div class="footprint">
    <!-- 地图 -->
    <div class="footprint-map">
      <lChart ref="mapWrapperRef" />
    </div>

    <!-- 容器 -->
    <scroll-view
      class="footprint-container"
      :scroll-y="scrollY"
      :style="{ height: containerSize + 'px' }"
      @touchmove="handleTouchMove"
      @touchstart="startDrag"
    >
      <div class="footprint-container-box">
        <!-- 省份列表 -->
        <template v-if="provinceList && provinceList.length">
          <div
            class="footprint-item"
            v-for="(item, index) in provinceList"
            :key="index"
          >
            <image
              class="footprint-item-banner"
              :src="`${VUE_APP_API_URL}/images/province/${item.province_code}.png`"
            />

            <div class="footprint-item-content">
              <div class="footprint-item-name">
                {{ item.province_name }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </scroll-view>
  </div>
</template>

<style lang="scss">
  .footprint {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #d1f2ff;
    padding: 70px 0 0 0;
    box-sizing: border-box;

    // 地图
    .footprint-map {
      width: 100vw;
      height: 100vw;
      position: relative;
      right: 0;
      top: 0;
      left: 0;
    }

    // 容器
    &-container {
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
      height: 200px;
      padding: 20px;
      border-radius: 24px 24px 0 0;
      background-color: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      overflow: auto;
      box-sizing: border-box;
      max-height: 700px;
      transition: 0.7s;
      width: auto;

      ::-webkit-scrollbar {
        width: 0;
      }

      ::-webkit-scrollbar-horizontal {
        display: none;
      }

      // 省份列表
      .footprint-item {
        display: flex;

        // 图片
        &-banner {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        // 内容
        &-content {
          flex: 1;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
