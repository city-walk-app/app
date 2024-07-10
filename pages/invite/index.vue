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

  /**
   * 获取微信二维码
   */
  const getWxQrCode = async (access_token) => {
    uni.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacode',
      data: {
        access_token,
      },
      header,
      method: 'POST',
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data)
        } else {
          toast(res.data.message)
        }
      },
      fail: () => {
        toast('网络连接失败')
      },
    })
  }

  /**
   * 获取 AccessToken
   */
  const getWxAccessToken = async () => {
    const res = await API.getWxAccessToken({})

    if (res.code === 200) {
      getWxQrCode(res.data.access_token)
    }
  }

  getWxAccessToken()
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
