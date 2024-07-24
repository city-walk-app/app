<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { VUE_APP_API_URL, getCurrentDateFormatted } from '@/utils'
  import { onLoad, onShow } from '@dcloudio/uni-app'

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
      date: getCurrentDateFormatted(),
    })

    if (res.code === 200 && res.data && res.data.length) {
      heatmap.value = res.data.map((item) => {
        return {
          ...item,
          _active: false,
        }
      })
    }
  }

  /**
   * 获取当前用户走过的省份列表
   */
  const getUserProvinceJigsaw = async () => {
    const res = await API.getUserProvinceJigsaw({ user_id: userId.value })

    if (res.code === 200) {
      provinceList.value = res.data
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
    uni.navigateTo({
      url: `/pages/route-detail/index?list_id=${list_id}`,
    })
  }

  /**
   * 返回
   */
  const back = () => {
    uni.navigateBack({ delta: 1 })
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
  <div class="main">
    <!-- 背景 -->
    <image
      class="main-blank"
      src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-blank.png"
    />

    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <image class="back-icon" src="/assets/svg/left.svg" />
    </div>

    <!-- 头部信息 -->
    <div class="header" v-if="userInfo">
      <!-- 头像 -->
      <div class="header-avatar-box">
        <image
          class="header-avatar-image"
          mode="aspectFill"
          src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
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
          <image
            class="jigsaw-image"
            :src="`${VUE_APP_API_URL}/images/province/${item.province_code}.png`"
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
                background: item.heatmap_color ? item.heatmap_color : 'none',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情步行 -->
    <div class="details" v-if="routeDetailList && routeDetailList.length">
      <div class="details-left"></div>
      <div class="details-right">
        <div
          class="details-right-item"
          v-for="(item, index) in routeDetailList"
          :key="index"
        >
          <div class="details-right-item-header">
            <!-- 头部左侧 -->
            <div class="details-right-item-header-left">
              <div class="details-right-item-header-time">
                {{ item.create_at }}
              </div>
              <div class="details-right-item-header-address">
                {{ item.address || item.city }}
              </div>
            </div>
            <div class="details-right-item-header-left"></div>
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
</template>

<style lang="scss" scoped>
  .main {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    position: relative;

    .back {
      width: 68rpx;
      height: 68rpx;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 0rpx 2rpx 23rpx 0rpx rgba(158, 158, 158, 0.25);
      border-radius: 50%;
      position: fixed;
      z-index: 10;
      top: 134rpx;
      left: 32rpx;

      .back-icon {
        width: 50rpx;
        height: 50rpx;
        flex-shrink: 0;
      }
    }

    // 背景
    .main-blank {
      width: 100vw;
      height: 440rpx;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
    }

    // 头部信息
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 154rpx 34rpx 0 34rpx;
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
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 36rpx;
        color: #333333;
        line-height: 42rpx;
        margin-top: 32rpx;
      }

      // 签名
      .header-signature {
        font-family: PingFang SC, PingFang SC;
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
          font-family: PingFang SC, PingFang SC;
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
              font-family: PingFang SC, PingFang SC;
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
            background: url('/assets/svg/main-heatmap-check.svg') no-repeat;
            background-position: center;
            background-size: cover;

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
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 32rpx;
          color: #ffffff;
          line-height: 38rpx;
          position: absolute;
          top: 55rpx;
          right: 32rpx;
        }

        .routes-item-date {
          font-family: PingFang SC, PingFang SC;
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
