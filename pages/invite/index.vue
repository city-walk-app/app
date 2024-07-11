<script setup>
  import { ref } from 'vue'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'

  const API = new Api()

  /**
   * 邀请朋友
   */
  const friendInvite = async () => {
    const res = await API.friendInvite()

    if (res.code === 200) {
      await uni.setClipboardData({
        data: 'CityWalk:' + res.data,
      })
    }
  }

  const qrCodeBase64 = ref('')

  /**
   * 获取邀请二维码
   */
  const getInviteQrCode = async () => {
    const res = await API.getInviteQrCode({})

    if (res.code === 200) {
      qrCodeBase64.value = res.data
    }
  }

  getInviteQrCode() // 获取邀请二维码
</script>

<template>
  <div class="friends">
    <div class="header">
      <h1>邀请朋友</h1>
      <img :src="qrCodeBase64" alt="" />

      <div @click="friendInvite">复制邀请链接</div>
    </div>
  </div>
</template>

<style lang="scss"></style>
