<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { getCurrentDateFormatted, formatTime } from '@/utils'
  import { onLoad, onShow } from '@dcloudio/uni-app'
  import StickyScroll from '@/components/sticky-scroll'

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

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    const res = await API.getUserInfo({ user_id: userId.value })

    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  /**
   * 获取用户指定月份打卡热力图
   */
  const getLocationUserHeatmap = async () => {
    const res = await API.getLocationUserHeatmap({
      // date: getCurrentDateFormatted(),
    })

    if (res.code === 200 && res.data && res.data.length) {
      heatmap.value = res.data.map((item) => {
        return {
          ...item,
          _active: false,
        }
      })

      console.log(heatmap.value)
    }
  }

  /**
   * 获取当前用户走过的省份列表
   */
  const getUserProvinceJigsaw = async () => {
    const res = await API.getUserProvinceJigsaw({ user_id: userId.value })

    if (res.code === 200) {
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

  /**
   * 获取当前用户走过的省份列表
   */
  const getUserRouteList = async () => {
    const res = await API.getUserRouteList({ user_id: userId.value })

    if (res.code === 200) {
      routeList.value = res.data
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
    } else {
      routeDetailList.value = []
    }
  }

  /**
   * 点击查看详情
   *
   * @param list_id
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

  onLoad((options) => {
    userId.value = options.user_id

    getUserInfo() // 获取用户信息
    getUserRouteList() // 获取用户步行记录列表
    getUserProvinceJigsaw() // 获取当前用户走过的省份列表
  })

  onShow(() => {
    getLocationUserHeatmap() // 获取用户指定月份打卡热力图
  })
</script>

<template>
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
      <div class="header" v-if="userInfo">
        <!-- 头像 -->
        <div class="header-avatar-box">
          <image
            class="header-avatar-image"
            mode="aspectFill"
            :src="userInfo.avatar || DEFAULT_AVATAR"
          />
        </div>

        <!-- 昵称 -->
        <div class="header-nick-name" v-if="userInfo.nick_name">
          {{ userInfo.nick_name }}
        </div>

        <!-- 签名 -->
        <div class="header-signature" v-if="userInfo.signature">
          {{ userInfo.signature }}
        </div>
      </div>

      <!-- 省份版图列表 -->
      <scroll-view
        v-if="provinceList && provinceList.length"
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
          <div class="heatmap-header-pick">2024年07月</div>
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

          <!-- 右侧图表 -->
          <div class="heatmap-body-right" v-if="heatmap && heatmap.length">
            <div
              class="heatmap-body-right-item-wrapper"
              v-for="(item, index) in heatmap"
              :key="index"
              @click="heatmapItemClick(item)"
            >
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
              ></div>
            </div>
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
              <image
                v-if="index === 0"
                class="details-everyone-time-line-avatar"
                src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
                mode="aspectFill"
              />

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
                  :scroll-x="false"
                  scroll-y
                >
                  <div class="details-everyone-item-body-picture-wrapper">
                    <image
                      v-for="(item, index) in item.picture"
                      class="details-everyone-item-body-picture-item"
                      :src="item"
                      :key="index"
                      mode="aspectFill"
                    />
                  </div>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  </StickyScroll>
</template>

<style lang="scss">
  .main {
    position: relative;
    // background-color: #faf9fa;

    // 头部信息
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 34rpx;
      box-sizing: border-box;

      // 头像
      .header-avatar-box {
        width: 148rpx;
        height: 148rpx;
        border-radius: 50%;

        .header-avatar-image {
          width: inherit;
          height: inherit;
          border-radius: inherit;
        }
      }

      // 昵称
      .header-nick-name {
        font-weight: 400;
        font-size: 36rpx;
        color: #333333;
        line-height: 42rpx;
        margin-top: 32rpx;
      }

      // 签名
      .header-signature {
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 33rpx;
        margin-top: 16rpx;
      }
    }

    // 版图列表
    .jigsaw-scroll {
      width: 100vw;
      height: 310rpx;

      .jigsaw-wrapper {
        width: inherit;
        height: inherit;
        padding: 48rpx 34rpx;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        column-gap: 22rpx;

        .jigsaw-item {
          width: 214rpx;
          height: 214rpx;

          .jigsaw-image {
            width: inherit;
            height: inherit;
            mask: var(--province) 0 0 / cover no-repeat;
            -webkit-mask: var(--province) 0 0 / cover no-repeat;
            background: var(--background);
          }
        }
      }
    }

    // 热力图
    .heatmap {
      padding: 0 32rpx;
      box-sizing: border-box;

      // 头部
      .heatmap-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .heatmap-header-pick {
          height: 52rpx;
          background: #f3f3f3;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
          padding: 0 16rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 400;
          font-size: 24rpx;
          color: #9a9a9a;
          line-height: 44rpx;
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

          .heatmap-body-right-item-wrapper {
            width: 54rpx;
            height: 52rpx;
            border-radius: 8rpx;
            background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-heatmap-check.svg')
              no-repeat center / cover;

            .heatmap-body-right-item {
              width: inherit;
              height: inherit;
              border-radius: inherit;
              transition: 0.3s;

              // 选中状态
              &.heatmap-body-right-item-active {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
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
            .details-everyone-time-line-avatar {
              width: 92rpx;
              height: 92rpx;
              border-radius: 50%;
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

                .details-everyone-item-body-picture-wrapper {
                  display: flex;
                  flex-wrap: nowrap;
                  column-gap: 24rpx;

                  .details-everyone-item-body-picture-item {
                    width: 348rpx;
                    height: 350rpx;
                    border-radius: 16rpx;
                    flex-shrink: 0;
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
    }
  }
</style>
