<script setup>
  import { Api } from '@/api'
  import { getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { ref, provide } from 'vue'
  import PageHome from '@/pages/home/index.vue'
  import PageUser from '@/pages/user/index.vue'
  import PageRanking from '@/pages/ranking/index.vue'
  import PageRouteHistory from '@/pages/route-history/index.vue'

  const API = new Api()

  const barActive = ref(0)

  /** 用户信息 */
  const userInfo = ref({})
  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

  provide('userInfo', userInfo)
  provide('userInfoStorage', userInfoStorage)

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (!userInfoStorage.value || !userInfoStorage.value.id) {
      return
    }

    const res = await API.getUserInfo({ id: userInfoStorage.value.id })

    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  const barList = [
    { title: '首页', icon: 'icon-shouye' },
    { title: '排行', icon: 'icon-jiangbei-' },
    { title: '记录', icon: 'icon-lishi' },
    { title: '我的', icon: 'icon-yonghu' },
  ]

  /**
   * 切换底部标签页面
   */
  const changeBar = (index) => {
    barActive.value = index
    userInfoStorage.value = getStorage(USER_INFO)
  }

  /**
   * 跳转登陆页面
   */
  const goLogin = () => {
    uni.navigateTo({
      url: '/pages/login/index',
    })
  }

  getUserInfo() // 获取用户信息
</script>

<template>
  <div class="layout" v-if="userInfoStorage && userInfoStorage.user_id">
    <div class="body" v-show="barActive === 0">
      <PageHome />
    </div>
    <div class="body" v-show="barActive === 1">
      <PageRanking />
    </div>
    <div class="body" v-show="barActive === 2">
      <PageRouteHistory />
    </div>
    <div class="body" v-show="barActive === 3">
      <PageUser />
    </div>

    <div class="bar">
      <div class="bar-wrapper">
        <div class="bar-wrapper-mask"></div>
        <div class="bar-wrapper-content">
          <div
            class="bar-item"
            v-for="(item, index) in barList"
            :key="index"
            @click="changeBar(index)"
          >
            <div
              :class="[
                'bar-item-icon',
                {
                  'bar-item-icon-active': barActive === index,
                },
              ]"
            >
              <i :class="['city-icon', item.icon]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 未登录 -->
  <div v-else class="layout-out">
    <!-- 没有身份信息显示登录按钮 -->
    <div class="login">
      <div class="login-title">登录后体验更多功能</div>
      <div class="go-login" @click="goLogin">去登录</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .layout {
    box-sizing: border-box;
    position: relative;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;

    // 主要内容
    .body {
      overflow-y: auto;
      overflow-x: hidden;
    }

    // 底部切换
    .bar {
      height: 76px;
      width: 100vw;
      display: flex;
      align-items: center;
      padding: 0 30px 10px 30px;
      box-sizing: border-box;
      position: relative;
      z-index: 200;
      position: fixed;
      right: 0;
      bottom: env(safe-area-inset-bottom);
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .bar-wrapper {
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        z-index: 20;

        .bar-wrapper-mask {
          position: absolute;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.5);
        }

        .bar-wrapper-content {
          // background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(25px);
          column-gap: 15px;
          width: 100%;
        }

        // &::after {
        //   content: '';
        //   display: block;
        //   position: absolute;
        //   inset: 0;
        //   background-color: red;
        //   z-index: 10;
        // }

        .bar-item {
          height: 80px;
          width: 70px;
          display: flex;
          justify-content: center;
          align-items: center;

          .bar-item-icon {
            padding: 13px;
            box-sizing: border-box;
            border-radius: 15px;
            transition: 0.2s;

            &.bar-item-icon-active {
              background-color: #ef5a66;

              .city-icon {
                color: #fff;
                font-weight: bold;
              }
            }

            .city-icon {
              font-size: 24px;
              color: #333;
              transition: 0.2s;
            }
          }
        }
      }
    }
  }

  // 未登录
  .layout-out {
    width: 100vw;
    height: 100vh;

    // 登录提示
    .login {
      background-color: #f3f3f3;
      border-radius: 10px;
      padding: 15px 17px;
      box-sizing: border-box;
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      margin-top: 90px;

      // 标题
      &-title {
        font-size: 15px;
        color: #333;
        font-weight: bold;
      }

      .go-login {
        width: 80px;
        height: 30px;
        background-color: #0ba360;
        border-radius: 8px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
