<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { onShareAppMessage } from '@dcloudio/uni-app'
  import { useGlobalStore } from '@/store'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()
  const useGlobal = useGlobalStore()

  console.log(useGlobal.headerBtnPosi)
  console.log(useGlobal.navBarHeight)

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

  /**
   * 分享
   */
  onShareAppMessage(async ({ from }) => {
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
  <StickyScroll title="邀请朋友">
    <div class="invite">
      <!-- 内容 -->
      <div class="main">
        <div class="body">
          <div class="body-banner"></div>
          <div class="body-footer">
            <image
              class="body-footer-qr-code"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/qr-code.jpg"
            />
            <div class="body-footer-text">长按识别二维码加我好友</div>
          </div>
        </div>
        <h1 v-for="i in 100">12</h1>
      </div>

      <!-- 底部 -->
      <div class="footer">
        <button open-type="share" class="footer-button-link">分享链接</button>
        <div class="footer-button-image">分享海报</div>
      </div>
    </div>
  </StickyScroll>
</template>

<style lang="scss">
  .invite {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    padding: 0 32rpx 94rpx 32rpx;
    box-sizing: border-box;

    .main {
      box-sizing: border-box;

      // 头部
      .header {
        display: flex;
        align-items: center;
        column-gap: 32rpx;
        position: sticky;
        z-index: 50;

        .title {
          font-weight: bold;
          transition: 0.09s;
          font-size: 56rpx;
          color: #333333;
          line-height: 66rpx;
        }

        .back {
          width: 68rpx;
          height: 68rpx;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0rpx 2rpx 23rpx 0rpx rgba(158, 158, 158, 0.25);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      // 内容
      .body {
        margin-top: 44rpx;
        width: 100%;
        height: 1120rpx;
        border-radius: 44rpx;
        background-color: #fff;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        box-shadow: 0rpx 2rpx 23rpx 0rpx rgba(158, 158, 158, 0.25);

        .body-banner {
          width: 100%;
          height: 806rpx;
          border-radius: 44rpx 44rpx 0 0;
          background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/demos/invite-banner.png')
            no-repeat;
          background-position: center;
          background-size: cover;
        }

        .body-footer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          row-gap: 24rpx;
          flex: 1;

          .body-footer-qr-code {
            width: 188rpx;
            height: 188rpx;
            flex-shrink: 0;
          }

          .body-footer-text {
            font-weight: 400;
            font-size: 28rpx;
            color: #666666;
            line-height: 33rpx;
          }
        }
      }
    }

    // 底部操作
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      column-gap: 46rpx;
      position: fixed;
      bottom: 94rpx;
      right: 0;
      left: 0;

      .footer-button-link {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 320rpx;
        height: 96rpx;
        padding: 0;
        margin: 0;
        border-radius: 28rpx;
        border: 3rpx solid #f3943f;
        font-weight: 400;
        font-size: 32rpx;
        color: #f3943f;
        line-height: 38rpx;
        background-color: #fff;
      }

      .footer-button-image {
        width: 320rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 96rpx;
        background: #f3943f;
        border-radius: 28rpx;
        border: 3rpx solid #f3943f;
        font-weight: 400;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 38rpx;
      }
    }
  }
</style>
