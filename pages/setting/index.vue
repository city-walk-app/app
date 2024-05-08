<script setup>
  import { ref } from 'vue'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'

  const API = new Api()

  /** 身份卡片信息 */
  const infoCards = ref([
    { key: 'avatar', active: false, title: '头像' },
    { key: 'nick_name', active: false, title: '名字' },
    { key: ['province', 'city'], active: false, title: '位置' },
    { key: 'birthday', active: false, title: '生日' },
    { key: 'signature', active: false, title: '签名' },
    { key: 'email', active: false, title: '邮箱' },
    { key: 'mobel', active: false, title: '手机' },
  ])

  /** 用户信息 */
  const userInfo = ref({})
  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (userInfo.value && userInfo.value.id) {
      return
    }

    const res = await API.getUserInfo({ id: userInfoStorage.value.id })

    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  getUserInfo()

  /**
   * 点击退出登录
   */
  const outLogin = () => {
    uni.showModal({
      title: '退出登录',
      content: '确定退出登录吗？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          uni.clearStorage()
          uni.navigateTo({
            url: '/pages/layout/index',
          })
        }
      },
    })
  }

  /**
   * 卡片长按事件
   */
  const handleLongPress = (item) => {
    const _infoCards = infoCards.value
    const activeItem = _infoCards.find((e) => e.key === item.key)

    activeItem.active = true
    infoCards.value = _infoCards
  }
</script>

<template>
  <scroll-view class="setting" scroll-y>
    <div class="setting-wrapper" v-if="userInfo">
      <div
        class="setting-card"
        v-for="(item, index) in infoCards"
        :key="index"
        :style="{ backdropFilter: `blur(${item.active ? 0 : 45}px)` }"
        @longpress="handleLongPress(item)"
      >
        <div class="setting-card-title">{{ item.title }}</div>
        <image
          v-if="item.key === 'avatar'"
          model="aspectFill"
          class="user-avatar"
          :src="VUE_APP_API_URL + userInfo.avatar"
        />
        <div v-else-if="Array.isArray(item.key)" class="setting-card-content">
          {{ userInfo.province || '' }}{{ userInfo.city || '' }}
        </div>
        <div v-else class="setting-card-content">
          {{ userInfo[item.key] || '未设置' }}
        </div>
      </div>

      <!-- 退出登录 -->
      <div class="setting-card" @click="outLogin">
        <div class="setting-card-title">账号</div>
        <div class="setting-card-danger-content">退出登录</div>
      </div>
    </div>
  </scroll-view>
</template>

<style lang="scss">
  .setting {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
    background-color: #eef;
    position: fixed;
    inset: 0;
    z-index: 20;

    .setting-wrapper {
      padding: 100px 15px 70px 15px;
      display: flex;
      flex-wrap: wrap;
      column-gap: 23px;
      row-gap: 24px;

      .setting-card {
        box-shadow: 0 2px 27px rgba(0, 0, 0, 0.1);
        padding: 20px 33px;
        box-sizing: border-box;
        border-radius: 18px;
        background-color: #fff;
        display: inline-block;
        position: relative;

        // 标题
        .setting-card-title {
          font-size: 16px;
          color: #111;
          width: 100%;
          margin-bottom: 21px;
        }

        // 危险标题
        .setting-card-danger-content {
          font-size: 22px;
          color: #ff0200;
          font-weight: bold;
          margin-top: 20px;
        }

        // 头像
        .user-avatar {
          width: 99px;
          height: 99px;
          border-radius: 50%;
        }

        // 文字内容
        .setting-card-content {
          font-size: 22px;
          color: #2f2e30;
          font-weight: bold;
          margin-top: 20px;
        }
      }
    }
  }
</style>
