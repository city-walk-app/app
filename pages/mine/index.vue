<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { VUE_APP_API_URL } from '@/utils'
  import { onLoad } from '@dcloudio/uni-app'

  const API = new Api()

  /** 用户信息 */
  const userInfo = ref()
  /** 省份列表 */
  const provinceList = ref()
  /** 步行记录列表 */
  const routeList = ref()
  /** 用户 id */
  const userId = ref()

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
   * 点击查看详情
   *
   * @param list_id
   */
  const routeDetail = (list_id) => {
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
</script>

<template>
  <!-- 背景图 -->
  <div class="user-background">
    <!-- 视差背景 -->
    <div class="background-wrapper" v-if="userInfo">
      <div
        class="background-image"
        :style="{
          background: `url(${VUE_APP_API_URL + userInfo.avatar}) no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      />
    </div>
  </div>
  <!-- 内容部分 -->
  <scroll-view class="user">
    <div class="user-main">
      <!-- 透明占位图 -->
      <div class="header" />

      <!-- 主要滚动的容器 -->
      <div class="body">
        <!-- 用户信息 -->
        <div class="info" v-if="userInfo">
          <!-- 头像 -->
          <image
            model="aspectFill"
            class="user-avatar"
            :src="VUE_APP_API_URL + userInfo.avatar"
          />

          <!-- 用户信息 -->
          <div class="user-nick-name">{{ userInfo.nick_name }}</div>
          <!-- 签名 -->
          <div class="user-signature" v-if="userInfo.signature">
            {{ userInfo.signature }}
          </div>
          <!-- 城市 -->
          <div class="user-city" v-if="userInfo.province">
            {{ userInfo.province }}
            <template v-if="userInfo.city"> - {{ userInfo.city }} </template>
          </div>
        </div>

        <!-- 省份版图列表 -->
        <scroll-view
          v-if="provinceList && provinceList.length"
          class="plate-scroll"
          scroll-x
          :scroll-y="false"
        >
          <div class="plate-wrapper">
            <div
              class="plate-item"
              v-for="(item, index) in provinceList"
              :key="index"
            >
              <image
                class="plate-node"
                :src="`${VUE_APP_API_URL}/images/province/${item.province_code}.png`"
              />
            </div>
          </div>
        </scroll-view>

        <!-- 步行记录列表 -->
        <div class="">
          <div
            v-for="(item, index) in routeList"
            :key="index"
            @click="routeDetail(item.list_id)"
          >
            {{ item.list_id }}
          </div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<style lang="scss">
  .user-background {
    position: fixed;
    inset: 0;

    .background-wrapper {
      width: 100vw;
      height: 200px;
      overflow: hidden;

      .background-image {
        width: 100vw;
        height: inherit;
        filter: blur(22px);
        position: relative;
        transform: scale(1.4);
        position: absolute;
        inset: 0;
        z-index: -1;
      }
    }
  }

  .user {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100vw;
    height: 100%;
    position: fixed;
    inset: 0;
    z-index: 10;
    box-sizing: border-box;

    .user-main {
      display: flex;
      flex-direction: column;

      // 头部背景
      .header {
        width: 100vw;
        height: 160px;
        background-color: transparent;
      }

      // 身体主要内容
      .body {
        width: 100vw;
        background-color: #fff;
        border-radius: 24px 24px 0 0;
        flex: 1;

        // 用户信息
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          top: -45px;
          padding: 0 30px;
          box-sizing: border-box;

          // 头像
          .user-avatar {
            width: 99px;
            height: 99px;
            border-radius: 50%;
            border: 4px solid #eee;
          }

          // 昵称
          .user-nick-name {
            font-size: 22px;
            color: #222;
            font-weight: bold;
            margin-top: 10px;
          }

          // 签名
          .user-signature {
            font-size: 16px;
            margin-top: 10px;
          }

          // 城市
          .user-city {
            font-size: 13px;
            margin-top: 5px;
          }

          .active-list {
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .active-item {
              display: flex;
              align-items: center;
              margin-bottom: 5px;
              flex: 1;
              flex-shrink: 0;

              .active-icon {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 5px;

                .city-icon {
                  color: #fff;
                }

                .active-icon-img {
                  display: none;
                  width: 16px;
                  height: 16px;
                }

                .province-banner {
                  width: 16px;
                  height: 16px;
                  position: relative;
                  overflow: hidden;
                  background: #fff;
                }
              }

              &:nth-child(1) .active-icon {
                background-color: #fe6ab4;
              }

              &:nth-child(2) .active-icon {
                background-color: #1bd4b2;
              }

              &:nth-child(3) .active-icon {
                background-color: #77b0f7;
              }
            }
          }
        }

        // 图表
        .plate-scroll {
          width: 100%;
          overflow-y: auto;
          padding: 10px 14px;
          box-sizing: border-box;

          .plate-wrapper {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;

            .plate-item {
              width: 120px;
              height: 120px;
              display: flex;
              justify-content: center;
              align-items: center;

              .plate-node {
                width: 100px;
                height: 100px;
              }
            }
          }
        }
      }
    }
  }
</style>
