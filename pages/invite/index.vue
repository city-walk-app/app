<script setup>
  import { ref } from 'vue'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'
  import { onShareAppMessage } from '@dcloudio/uni-app'

  const API = new Api()

  /**
   * 邀请朋友
   */
  const friendInvite = async () => {
    const res = await API.friendInvite()

    if (res.code === 200) {
      return res.data
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

  // getInviteQrCode() // 获取邀请二维码

  /**
   * 分享
   */
  onShareAppMessage(async ({ from, target }) => {
    // console.log(evt)
    if (from === 'button') {
      const inviteId = await friendInvite()
      return {
        title: '邀请你加我为好友',
        path: `/pages/home/index?invite_id=${inviteId}`, // 邀请链接
        imageUrl: 'https://docs.city-walk.top/Logo.png', // 分享时显示的图片
      }
    }
  })
</script>

<template>
  <div class="friends">
    <div class="header">
      <h1>邀请朋友</h1>
      <img :src="qrCodeBase64" alt="" />

      <div @click="friendInvite">复制邀请链接</div>

      <button open-type="share">邀请</button>
    </div>
  </div>
</template>

<style lang="scss"></style>
