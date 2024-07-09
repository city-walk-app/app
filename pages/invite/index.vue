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
</script>

<template>
  <div class="friends">
    <div class="header">
      <h1>邀请朋友</h1>

      <div @click="friendInvite">复制邀请链接</div>
    </div>
  </div>
</template>

<style lang="scss"></style>
