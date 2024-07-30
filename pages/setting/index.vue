<script setup>
  import { ref } from 'vue'
  import { getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'
  import Sheet from '@/components/sheet'

  const API = new Api()

  /** 用户信息 */
  const userInfo = ref()
  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (userInfo.value && userInfo.value.user_id) {
      return
    }

    const res = await API.getUserInfo({
      user_id: userInfoStorage.value.user_id,
    })

    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  // getUserInfo()

  /**
   * 点击退出登录
   */
  const outLogin = async () => {
    const res = await uni.showModal({
      title: '退出登录',
      content: '确定退出登录吗？',
      showCancel: true,
    })

    console.log(res)

    /**
     *     success: (res) => {
        if (res.confirm) {
          uni.clearStorage()
          uni.navigateTo({ url: '/pages/home/index' })
        }
      },
     */
  }
</script>

<template>
  <div class="setting">setting</div>
</template>

<style lang="scss"></style>
