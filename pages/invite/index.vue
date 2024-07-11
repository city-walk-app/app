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
        path: 'pages/home/index?code=121211',
      },
      method: 'GET',
      header: {
        'content-type': 'application/json', // 注意这里需要设置请求头
      },
      method: 'POST',
      responseType: 'arraybuffer', // 这里指定返回类型为 arraybuffer
      success: (res) => {
        console.log('返回结果', res)

        // if (res.statusCode === 200) {
        //   // 将二进制数据转为 base64
        //   let base64 = uni.arrayBufferToBase64(res.data)
        //   resolve(`data:image/png;base64,${base64}`)
        // } else {
        //   // toast(res.data.message)
        //   reject(res.data.message)
        // }
        // if (res.statusCode === 200 || res.statusCode === 201) {
        //   resolve(res.data)
        // } else {
        //   toast(res.data.message)
        // }
      },
      fail: () => {
        // toast('网络连接失败')
      },
    })
  }

  const qrCodeBase64 = ref('')

  /**
   * 获取 AccessToken
   */
  const getWxAccessToken = async () => {
    const res = await API.getWxAccessToken({})

    if (res.code === 200) {
      // const qrCode = await getWxQrCode(res.data.access_token)

      // console.log(qrCode)

      qrCodeBase64.value = res.data
    }
  }

  getWxAccessToken()
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
