<script setup>
  import { ref, reactive } from 'vue'
  import { Api } from '@/api'
  import {
    getCurrentDateFormatted,
    formatTime,
    showLoading,
    hideLoading,
    previewImage,
    isArray,
    toast,
  } from '@/utils'
  import { DEFAULT_AVATAR } from '@/enum'
  import { onLoad } from '@dcloudio/uni-app'
  import StickyScroll from '@/components/sticky-scroll'
  import Empty from '@/components/empty'
  import Sheet from '@/components/sheet'
  import CwButton from '@/components/cw-button'

  const API = new Api()

  /** 用户信息 */
  const userInfo = ref()
  /** 省份列表 */
  const provinceList = ref()
  /** 步行记录列表 */
  const routeList = ref()
  /** 用户 id */
  const userId = ref()
  /** 热力图 */
  const heatmap = ref()
  /** 步行记录详情列表 */
  const routeDetailList = ref()
  /** 是否正在加载版图列表 */
  const provinceListLoading = ref(true)
  /** 是否正在加载步行记录列表 */
  const routeListLoading = ref(true)
  /** 是否显示对话框 */
  const visibleSheet = ref(false)
  /** 月份选择列表 */
  const monthSelectList = ref([
    { title: '一', key: '01' },
    { title: '二', key: '02' },
    { title: '三', key: '03' },
    { title: '四', key: '04' },
    { title: '五', key: '05' },
    { title: '六', key: '06' },
    { title: '七', key: '07' },
    { title: '八', key: '08' },
    { title: '九', key: '09' },
    { title: '十', key: '10' },
    { title: '十一', key: '11' },
    { title: '十二', key: '12' },
  ])
  /** 年份选择列表 */
  const yearSelectList = ref()
  /** 当前时间 */
  const date = new Date()
  /** 热力图筛选参数 */
  const heatmapDateParams = reactive({
    year: date.getFullYear(),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
  })
  /** 热力图每一项的详情 */
  const heatmapItemDetail = ref()

  /**
   * 设置年份数组
   *
   * 项目从 2024 年开始，所以开始年份就是 2024 年
   */
  const setYearSelectList = (startYear, endYear) => {
    const yearsArray = []

    for (let year = startYear; year <= endYear; year++) {
      yearsArray.push(year)
    }

    yearSelectList.value = yearsArray
    console.log(yearSelectList.value)
  }

  setYearSelectList(2024, new Date().getFullYear()) // 设置年份数组

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    try {
      const res = await API.getUserInfo({ user_id: userId.value })

      if (res.code === 200) {
        userInfo.value = res.data
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 获取用户指定月份打卡热力图
   */
  const getLocationUserHeatmap = async (date = {}) => {
    try {
      const res = await API.getLocationUserHeatmap({
        user_id: userId.value,
        ...date,
      })

      if (res.code === 200) {
        if (isArray(res.data)) {
          heatmap.value = res.data.map((item) => {
            return {
              ...item,
              _active: false,
            }
          })

          console.log(heatmap.value)
        }
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 获取当前用户走过的省份列表
   */
  const getUserProvinceJigsaw = async () => {
    try {
      provinceListLoading.value = true

      const res = await API.getUserProvinceJigsaw({ user_id: userId.value })

      provinceListLoading.value = false

      if (res.code === 200) {
        if (isArray(res.data)) {
          provinceList.value = res.data.map((item) => {
            return {
              ...item,
              province_url: item.province_code
                ? `https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/provinces/${item.province_code}.png`
                : '',
            }
          })
        }
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 获取用户步行记录列表
   */
  const getUserRouteList = async () => {
    try {
      routeListLoading.value = true

      const res = await API.getUserRouteList({ user_id: userId.value })

      routeListLoading.value = false

      if (res.code === 200) {
        routeList.value = res.data
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 热力图每一项点击
   */
  const heatmapItemClick = (item) => {
    item._active = !item._active

    console.log(item)

    if (item._active) {
      routeDetailList.value = item.routes
      heatmapItemDetail.value = item
    } else {
      routeDetailList.value = null
      heatmapItemDetail.value = null
    }
  }

  /**
   * 点击查看详情
   */
  const routeDetail = (list_id) => {
    if (!list_id) {
      toast('无法查看')
      return
    }

    uni.navigateTo({
      url: `/pages/route-detail/index?list_id=${list_id}`,
    })
  }

  /**
   * 关闭对话框
   */
  const closeSheet = () => {
    visibleSheet.value = false
  }

  /**
   * 打开对话框
   */
  const openSheet = () => {
    visibleSheet.value = true
  }

  /**
   * 热力图选择时间段筛选
   */
  const submitFilter = async () => {
    if (!heatmapDateParams.year || !heatmapDateParams.month) {
      toast('请选择年月')
      return
    }

    showLoading('筛选中...')

    await getLocationUserHeatmap(heatmapDateParams)

    hideLoading()

    closeSheet() // 关闭对话框
  }

  /**
   * 选择年份
   */
  const setYearSelect = (year) => {
    heatmapDateParams.year = year
  }

  /**
   * 选择月份
   */
  const setMonthSelect = (month) => {
    heatmapDateParams.month = month
  }

  /**
   * 点击预览图片
   */
  const previewPicture = async (urls, current) => {
    await previewImage(urls, current)
  }

  onLoad((options) => {
    userId.value = options.user_id

    getUserInfo() // 获取用户信息
    getUserRouteList() // 获取用户步行记录列表
    getUserProvinceJigsaw() // 获取当前用户走过的省份列表
    getLocationUserHeatmap() // 获取用户指定月份打卡热力图
  })
</script>

<template>
  <Sheet
    v-model:visible="visibleSheet"
    title="筛选时间段"
    is-move-close
    @on-close="closeSheet"
  >
    <!-- 我的页面 -->
    <StickyScroll
      :title-info="
        userInfo
          ? {
              name: userInfo.nick_name,
              avatar: userInfo.avatar || DEFAULT_AVATAR,
            }
          : null
      "
    >
      <div class="main">
        <!-- 头部信息 -->
        <div class="header">
          <!-- 头像 -->
          <div
            :class="[
              'header-avatar-wrapper',
              {
                'cw-skeleton-animated': !userInfo,
              },
            ]"
          >
            <image
              v-if="userInfo"
              class="header-avatar-image"
              mode="aspectFill"
              :src="userInfo.avatar || DEFAULT_AVATAR"
              @click="previewPicture([userInfo.avatar || DEFAULT_AVATAR])"
            />
          </div>

          <!-- 用户信息 -->
          <template v-if="userInfo">
            <!-- 昵称 -->
            <div class="header-nick-name">
              {{ userInfo.nick_name || '' }}
            </div>

            <!-- 签名 -->
            <div class="header-signature">
              {{ userInfo.signature || '' }}
            </div>
          </template>

          <!-- 用户信息-骨架图 -->
          <template v-else>
            <!-- 昵称骨架屏 -->
            <div class="cw-skeleton-animated header-nick-name__skeleton" />

            <!-- 签名骨架屏 -->
            <div class="cw-skeleton-animated header-nick-signature__skeleton" />
          </template>
        </div>

        <!-- 省份版图列表-骨架屏 -->
        <div v-if="provinceListLoading" class="jigsaw-scroll">
          <div class="jigsaw-wrapper">
            <div class="jigsaw-item" v-for="i in 3" :key="i">
              <div class="cw-skeleton-animated jigsaw-item__skeleton" />
            </div>
          </div>
        </div>

        <!-- 省份版图列表-加载完成 -->
        <scroll-view
          v-if="!provinceListLoading && provinceList && provinceList.length"
          class="jigsaw-scroll"
          scroll-x
          :scroll-y="false"
        >
          <div class="jigsaw-wrapper">
            <div
              class="jigsaw-item"
              v-for="(item, index) in provinceList"
              :key="index"
            >
              <div
                class="jigsaw-image"
                :style="{
                  '--province': `url('${item.province_url}')`,
                  '--background': item.background_color,
                }"
              />
            </div>
          </div>
        </scroll-view>

        <!-- 热力图 -->
        <div class="heatmap">
          <!-- 头部切换日期 -->
          <div class="heatmap-header">
            <div class="heatmap-header-date" @click="openSheet">
              <!-- 日历 -->
              <div class="heatmap-header-date-calendar">
                <image
                  class="heatmap-header-date-calendar-icon"
                  src="/assets/svg/main-calendar.svg"
                />
              </div>
              <div class="heatmap-header-date-time">
                {{ heatmapDateParams.year || '' }}-{{
                  heatmapDateParams.month || ''
                }}
              </div>
            </div>
          </div>

          <!-- 主要内容 -->
          <div class="heatmap-body">
            <!-- 左侧标识 -->
            <div class="heatmap-body-left">
              <div class="heatmap-body-left-item">
                <image
                  class="heatmap-body-left-item-icon"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-heatmap-1.png"
                />
                <div class="heatmap-body-left-item-text">打卡多</div>
              </div>
              <div class="heatmap-body-left-item">
                <image
                  class="heatmap-body-left-item-icon"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-heatmap-2.png"
                />
                <div class="heatmap-body-left-item-text">打卡少</div>
              </div>
              <div class="heatmap-body-left-item">
                <image
                  class="heatmap-body-left-item-icon"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-heatmap-3.png"
                />
                <div class="heatmap-body-left-item-text">未打卡</div>
              </div>
            </div>

            <!-- 右侧热力图-加载完成 -->
            <div
              :class="[
                'heatmap-body-right',
                {
                  'heatmap-body-right-active':
                    routeDetailList && routeDetailList.length,
                },
              ]"
              v-if="heatmap && heatmap.length"
            >
              <div
                class="heatmap-body-right-item-wrapper"
                v-for="(item, index) in heatmap"
                :key="index"
                @click="heatmapItemClick(item)"
              >
                <!-- 每一项 -->
                <div
                  :class="[
                    'heatmap-body-right-item',
                    {
                      'heatmap-body-right-item-active': item._active,
                    },
                  ]"
                  :style="{
                    background: item.background_color
                      ? item.background_color
                      : 'none',
                  }"
                />

                <!-- 详情 -->
                <div
                  v-if="heatmapItemDetail && item._active"
                  class="heatmap-body-right-item-detail"
                >
                  <div class="heatmap-body-right-item-date">
                    {{ heatmapItemDetail.date || '' }}
                  </div>
                  <div class="heatmap-body-right-item-content">
                    打卡{{ heatmapItemDetail.route_count || 0 }}个地点
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧热力图-骨架图 -->
            <div v-else class="heatmap-body-right">
              <div
                class="heatmap-body-right-item-wrapper"
                v-for="i in 31"
                :key="i"
              />
            </div>
          </div>
        </div>

        <!-- 详情步行 -->
        <div class="details" v-if="routeDetailList && routeDetailList.length">
          <!-- 左侧时间线 -->
          <!-- <div class="details-left"></div> -->

          <!-- 时间线 -->
          <div class="details-everyone">
            <div
              class="details-everyone-item"
              v-for="(item, index) in routeDetailList"
              :key="index"
            >
              <!-- 时间线 -->
              <div class="details-everyone-time-line">
                <div
                  v-if="index === 0"
                  class="cw-skeleton-animated details-everyone-time-line-avatar-wrapper"
                >
                  <image
                    v-if="userInfo"
                    class="details-everyone-time-line-avatar"
                    mode="aspectFill"
                    :src="userInfo.avatar || DEFAULT_AVATAR"
                  />
                </div>

                <!-- 圈 -->
                <div v-else class="details-everyone-time-line-circle">
                  <div class="details-everyone-time-line-circle-inner" />
                </div>
              </div>

              <!-- 详细记录 -->
              <div class="details-everyone-content">
                <!-- 图标 -->
                <image
                  class="details-everyone-item-icon-position"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-position.png"
                />

                <!-- 头部内容 -->
                <div class="details-everyone-item-header">
                  <!-- 头部内容 -->
                  <div class="details-everyone-item-content">
                    <div class="details-everyone-item-header-time">
                      {{ formatTime(item.create_at) }}
                    </div>
                    <div class="details-everyone-item-header-address">
                      {{ item.address || item.city }}
                    </div>
                  </div>
                </div>

                <!-- 身体内容 -->
                <div
                  v-if="item.content || (item.picture && item.picture.length)"
                  class="details-everyone-item-body"
                >
                  <!-- 文案 -->
                  <div
                    v-if="item.content"
                    class="details-everyone-item-body-content"
                  >
                    {{ item.content }}
                  </div>

                  <!-- 照片 -->
                  <scroll-view
                    v-if="item.picture && item.picture.length"
                    class="details-everyone-item-body-pictures"
                    scroll-x
                    :scroll-y="false"
                  >
                    <div class="details-everyone-item-body-picture-list">
                      <div
                        class="cw-skeleton-animated details-everyone-item-body-picture-item-wrapper"
                        v-for="(pictItem, index) in item.picture"
                        :key="index"
                        @click="previewPicture(item.picture, pictItem)"
                      >
                        <image
                          class="details-everyone-item-body-picture-item"
                          mode="aspectFill"
                          :src="pictItem"
                        />
                      </div>
                    </div>
                  </scroll-view>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步行记录列表-加载中 -->
        <div class="routes" v-if="routeListLoading">
          <div
            class="cw-skeleton-animated routes-item__skeleton"
            v-for="i in 3"
            :key="i"
          />
        </div>

        <!-- 步行记录列表-加载完成 -->
        <template v-else>
          <!-- 步行记录列表 -->
          <div class="routes" v-if="routeList && routeList.length">
            <div
              class="routes-item"
              v-for="(item, index) in routeList"
              :key="index"
              @click="routeDetail(item.list_id)"
            >
              <div class="routes-item-count">地点x{{ item.count }}</div>
              <div class="routes-item-date">
                {{ getCurrentDateFormatted(item.create_at) }}
              </div>
              <div class="routes-item-shadow"></div>
            </div>
          </div>

          <!-- 步行记录是空的 -->
          <div class="routes-empty" v-else>
            <Empty title="暂无打卡记录" />
          </div>
        </template>
      </div>
    </StickyScroll>

    <!-- 弹窗内容 -->
    <template #content>
      <div class="main-sheet">
        <!-- 内容 -->
        <div class="main-sheet-wrapper">
          <!-- 选择年份 -->
          <scroll-view
            class="main-sheet-wrapper-scroll"
            scroll-x
            :scroll-y="false"
          >
            <div class="main-sheet-item-wrapper" style="--width: 460rpx">
              <div
                :class="[
                  'main-sheet-item',
                  {
                    'main-sheet-item-active': heatmapDateParams.year === item,
                  },
                ]"
                v-for="(item, index) in yearSelectList"
                :key="index"
                @click="setYearSelect(item)"
              >
                <div class="main-sheet-item-title">{{ item }}年</div>
              </div>
            </div>
          </scroll-view>

          <!-- 选择月份 -->
          <scroll-view
            class="main-sheet-wrapper-scroll"
            scroll-x
            :scroll-y="false"
          >
            <div class="main-sheet-item-wrapper" style="--width: 300rpx">
              <div
                :class="[
                  'main-sheet-item',
                  {
                    'main-sheet-item-active':
                      heatmapDateParams.month === item.key,
                  },
                ]"
                v-for="(item, index) in monthSelectList"
                :key="index"
                @click="setMonthSelect(item.key)"
              >
                <div class="main-sheet-item-title">{{ item.title }}月</div>
              </div>
            </div>
          </scroll-view>
        </div>

        <!-- 提交按钮 -->
        <CwButton block @click="submitFilter">筛选</CwButton>
      </div>
    </template>
  </Sheet>
</template>

<style lang="scss">
  // 我的页面
  .main {
    position: relative;

    // 头部信息
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 34rpx;
      box-sizing: border-box;

      // 头像
      .header-avatar-wrapper {
        width: 148rpx;
        height: 148rpx;
        border-radius: 50%;
        background-color: var(--cw-skeleton-background-light);

        .header-avatar-image {
          width: inherit;
          height: inherit;
          border-radius: inherit;
        }
      }

      // 昵称
      .header-nick-name {
        font-weight: 400;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        color: #333333;
        line-height: 42rpx;
        margin-top: 32rpx;
      }

      // 昵称骨架屏
      .header-nick-name__skeleton {
        width: 108rpx;
        height: 50rpx;
        margin-top: 32rpx;
        background-color: var(--cw-skeleton-background-light);
      }

      // 签名
      .header-signature {
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 33rpx;
        margin-top: 16rpx;
      }

      // 签名骨架屏
      .header-nick-signature__skeleton {
        width: 560rpx;
        height: 40rpx;
        margin-top: 16rpx;
        background-color: var(--cw-skeleton-background-light);
      }
    }

    // 版图列表
    .jigsaw-scroll {
      width: 100vw;
      height: 214rpx;
      margin-top: 48rpx;

      .jigsaw-wrapper {
        width: inherit;
        height: inherit;
        padding: 0 34rpx;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        column-gap: 22rpx;

        .jigsaw-item {
          width: 214rpx;
          height: 214rpx;
          flex-shrink: 0;

          .jigsaw-image {
            width: inherit;
            height: inherit;
            mask: var(--province) 0 0 / cover no-repeat;
            -webkit-mask: var(--province) 0 0 / cover no-repeat;
            background: var(--background);
            flex-shrink: 0;
          }

          .jigsaw-item__skeleton {
            width: inherit;
            height: inherit;
            border-radius: 50%;
            background-color: var(--cw-skeleton-background-light);
          }
        }
      }
    }

    // 热力图
    .heatmap {
      padding: 0 32rpx;
      box-sizing: border-box;
      margin-top: 52rpx;

      // 头部
      .heatmap-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        // 日期
        .heatmap-header-date {
          background: #f3f3f3;
          border-radius: 4rpx;
          padding: 14rpx 23rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          column-gap: 13rpx;

          // 日历
          .heatmap-header-date-calendar {
            width: 32rpx;
            height: 32rpx;
            flex-shrink: 0;

            // icon
            .heatmap-header-date-calendar-icon {
              width: inherit;
              height: inherit;
              flex-shrink: 0;
            }
          }

          // 时间
          .heatmap-header-date-time {
            font-weight: 400;
            font-size: 24rpx;
            color: #9a9a9a;
            line-height: 44rpx;
          }
        }
      }

      // 内容部分
      .heatmap-body {
        display: flex;
        margin-top: 34rpx;
        align-items: flex-start;

        // 左侧图例
        .heatmap-body-left {
          width: 180rpx;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          row-gap: 60rpx;

          .heatmap-body-left-item {
            display: flex;
            align-items: center;
            column-gap: 14rpx;

            .heatmap-body-left-item-icon {
              width: 30rpx;
              height: 34rpx;
              flex-shrink: 0;
            }

            .heatmap-body-left-item-text {
              font-weight: 400;
              font-size: 28rpx;
              color: #666666;
              line-height: 33rpx;
            }
          }
        }

        // 右侧热力图
        .heatmap-body-right {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 24rpx;
          position: relative;
          overflow: hidden;

          // 选中的圆角
          &.heatmap-body-right-active {
            border-radius: 20rpx;
          }

          // 每一项容器
          .heatmap-body-right-item-wrapper {
            width: 54rpx;
            height: 52rpx;
            border-radius: 8rpx;
            background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-heatmap-check.svg')
              no-repeat center / cover;

            // 每一项
            .heatmap-body-right-item {
              width: inherit;
              height: inherit;
              border-radius: inherit;
              transition: transform 0.5s, border-radiu 0.5s;

              // 选中状态
              &.heatmap-body-right-item-active {
                transform: scale(20);
                border-radius: 0;
                z-index: 40;
              }
            }

            // 选中的文案详情
            .heatmap-body-right-item-detail {
              position: absolute;
              inset: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              row-gap: 18rpx;

              .heatmap-body-right-item-date {
                font-weight: 500;
                font-size: 44rpx;
                color: #ffffff;
                line-height: 52rpx;
              }

              .heatmap-body-right-item-content {
                font-weight: 500;
                font-size: 44rpx;
                color: #ffffff;
                line-height: 52rpx;
              }
            }
          }
        }
      }
    }

    // 当天记录详情
    .details {
      display: flex;
      margin-top: 54rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      position: relative;

      // 左侧
      .details-left {
        width: 152rpx;
        background-color: skyblue;
        flex-shrink: 0;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
      }

      // 右侧
      .details-everyone {
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 54rpx;
        width: 534rpx;

        // 每一项
        .details-everyone-item {
          width: 100%;
          display: flex;

          // 时间线
          .details-everyone-time-line {
            width: 152rpx;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            // 头像
            .details-everyone-time-line-avatar-wrapper {
              width: 92rpx;
              height: 92rpx;
              border-radius: 50%;
              flex-shrink: 0;
              background-color: var(--cw-skeleton-background-light);
              overflow: hidden;

              .details-everyone-time-line-avatar {
                width: inherit;
                height: inherit;
                border-radius: inherit;
                flex-shrink: 0;
              }
            }

            // 圈
            .details-everyone-time-line-circle {
              width: 40rpx;
              height: 40rpx;
              border-radius: 50%;
              border: 2rpx solid #f7b535;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #fff;

              .details-everyone-time-line-circle-inner {
                width: 24rpx;
                height: 24rpx;
                background: #f7b535;
                border: 2rpx solid #f7b535;
                border-radius: 50%;
              }
            }
          }

          // 内容部分
          .details-everyone-content {
            width: 534rpx;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: 0rpx 2rpx 11rpx 0rpx rgba(101, 101, 101, 0.1);
            position: relative;
            min-height: 92rpx;
            border-radius: 24rpx;

            // 图标
            .details-everyone-item-icon-position {
              width: 122rpx;
              height: 112rpx;
              flex-shrink: 0;
              position: absolute;
              top: 0;
              right: 0;
            }

            // 头部
            .details-everyone-item-header {
              display: flex;
              justify-content: flex-start;

              .details-everyone-item-content {
                background: linear-gradient(270deg, #fff8e8 0%, #ffffff 100%);
                padding: 24rpx 48rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                column-gap: 22rpx;
                border: 2rpx solid #ffffff;
                border-radius: 24rpx 0 120rpx 24rpx;

                // 时间
                .details-everyone-item-header-time {
                  font-weight: 500;
                  font-size: 32rpx;
                  color: #333333;
                  line-height: 38rpx;
                }

                // 位置
                .details-everyone-item-header-address {
                  font-weight: 400;
                  font-size: 28rpx;
                  color: #333333;
                  white-space: nowrap;
                  max-width: 200rpx;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }

            // 身体部分
            .details-everyone-item-body {
              padding: 28rpx 48rpx 46rpx 48rpx;
              box-sizing: border-box;

              // 文案
              .details-everyone-item-body-content {
                font-weight: 400;
                font-size: 28rpx;
                color: #666666;
                line-height: 33rpx;
              }

              // 图片
              .details-everyone-item-body-pictures {
                overflow-x: auto;
                margin-top: 24rpx;

                .details-everyone-item-body-picture-list {
                  display: flex;
                  flex-wrap: nowrap;
                  column-gap: 24rpx;

                  .details-everyone-item-body-picture-item-wrapper {
                    width: 348rpx;
                    height: 350rpx;
                    border-radius: 16rpx;
                    flex-shrink: 0;
                    overflow: hidden;
                    background-color: var(--cw-skeleton-background-light);

                    .details-everyone-item-body-picture-item {
                      width: inherit;
                      height: inherit;
                      border-radius: inherit;
                      flex-shrink: 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // 步行记录
    .routes {
      width: 100vw;
      padding: 48rpx 32rpx;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 34rpx;
      row-gap: 26rpx;

      // 每一项
      .routes-item {
        width: 326rpx;
        height: 232rpx;
        background: #af52dd;
        border-radius: 16rpx;
        position: relative;
        overflow: hidden;

        .routes-item-count {
          font-weight: 500;
          font-size: 32rpx;
          color: #ffffff;
          line-height: 38rpx;
          position: absolute;
          top: 55rpx;
          right: 32rpx;
        }

        .routes-item-date {
          font-weight: 400;
          font-size: 28rpx;
          color: #ffffff;
          line-height: 33rpx;
          position: absolute;
          right: 32rpx;
          bottom: 22rpx;
        }

        .routes-item-shadow {
          width: 326rpx;
          height: 127rpx;
          background: rgba(255, 255, 255, 0.05);
          border-image: linear-gradient(
              169deg,
              rgba(255, 255, 255, 1),
              rgba(153, 153, 153, 0)
            )
            1 1;
          position: absolute;
          right: 0;
          left: 0;
          bottom: 0;
        }
      }

      // 骨架图
      .routes-item__skeleton {
        width: 326rpx;
        height: 232rpx;
        background-color: var(--cw-skeleton-background-light);
        border-radius: 16rpx;
        position: relative;
        overflow: hidden;
      }
    }

    // 暂无记录
    .routes-empty {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  // 弹窗内容
  .main-sheet {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 60rpx 32rpx var(--cw-padding-bottom) 32rpx;
    box-sizing: border-box;

    // 内容
    .main-sheet-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      row-gap: 90rpx;

      .main-sheet-wrapper-scroll {
        width: inherit;

        .main-sheet-item-wrapper {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          column-gap: 19rpx;

          // 每一项
          .main-sheet-item {
            width: var(--width);
            height: 200rpx;
            flex-shrink: 0;
            background-color: var(--cw-skeleton-background-light);
            border-radius: 10rpx;
            padding: 30rpx 27rpx;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            transition: background 0.26s;

            .main-sheet-item-title {
              color: #333;
              font-weight: 600;
              font-size: 42rpx;
              transition: color 0.26s;
            }

            // 选中状态
            &.main-sheet-item-active {
              background-color: var(--cw-theme-1);

              .main-sheet-item-title {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
