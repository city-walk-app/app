<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { onShareAppMessage } from '@dcloudio/uni-app'
  import StickyScroll from '@/components/sticky-scroll'
  import CwButton from '@/components/cw-button'
  import { showLoading, hideLoading } from '../../utils'

  const API = new Api()

  /** 画板顶部高度 */
  const canvasTopHeight = ref(520)
  /** 画板底部高度 */
  const canvasBottomHeight = ref(160)

  /**
   * 邀请朋友
   */
  const friendInvite = async () => {
    try {
      const res = await API.friendInvite()

      if (res.code === 200) {
        return res.data
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 获取邀请二维码
   */
  const getInviteQrCode = async () => {
    try {
      const res = await API.getInviteQrCode({})

      if (res.code === 200) {
        return res.data
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 加载图片
   */
  const loadImage = async (src) => {
    try {
      const res = await uni.getImageInfo({ src })

      console.log(res)

      if (res.errMsg === 'getImageInfo:ok') {
        return res
      }
    } catch (err) {
      console.log('加载图片异常', err)
    }
  }

  /**
   * 绘制海报
   */
  const drawPoster = async () => {
    try {
      const context = uni.createCanvasContext('invite-poster')

      /** 加载顶部图片 */
      const topImage = await loadImage(
        'https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/demos/invite-banner.png'
      )
      const qrCodeImageBase64 = await getInviteQrCode()

      // 获取 canvas 宽高
      const { windowWidth } = uni.getSystemInfoSync()
      const canvasWidth = windowWidth
      /** 画板高度 */
      const canvasHeight = canvasTopHeight.value + canvasBottomHeight.value

      // 设置背景色
      context.setFillStyle('#ffffff')
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      // 绘制顶部图片
      const topImageHeight = canvasTopHeight.value
      context.drawImage(topImage.path, 0, 0, canvasWidth, topImageHeight)

      // 绘制中间二维码图片
      const qrCodeSize = 90
      const qrCodeX = (canvasWidth - qrCodeSize) / 2
      const qrCodeY =
        topImageHeight + (canvasBottomHeight.value - qrCodeSize) / 2 // 底部留白区域内垂直居中

      context.drawImage(
        qrCodeImageBase64,
        qrCodeX,
        qrCodeY,
        qrCodeSize,
        qrCodeSize
      )

      // 绘制底部文字
      const text = '长按识别二维码加我好友'
      context.setFontSize(16)
      context.setFillStyle('#333333')
      context.setTextAlign('center')
      context.fillText(text, canvasWidth / 2, canvasHeight - 20)

      context.draw()
    } catch (err) {
      console.log('绘制异常', err)
    }
  }

  /**
   * 分享海报
   */
  const sharePoster = async () => {
    try {
      showLoading('绘制中...')

      await drawPoster()

      const res = await uni.canvasToTempFilePath({
        canvasId: 'invite-poster',
      })

      hideLoading()

      // 分享图片
      if (res.errMsg === 'canvasToTempFilePath:ok') {
        // #ifdef MP-WEIXIN
        uni.showShareImageMenu({ path: res.tempFilePath })
        // #endif
      }
    } catch (err) {
      console.log('绘制异常', err)
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
        imageUrl:
          'https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/home-invite.png', // 分享时显示的图片
      }
    }
  })
</script>

<template>
  <StickyScroll title="邀请朋友">
    <!-- 绘制的海报图 -->
    <canvas
      class="invite-poster"
      canvas-id="invite-poster"
      id="invite-poster"
      :style="{
        '--height': canvasTopHeight + canvasBottomHeight + 'px',
      }"
    />

    <!-- 邀请 -->
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
      </div>

      <!-- 底部 -->
      <div class="footer">
        <CwButton type="line" @click="sharePoster">分享海报</CwButton>
        <CwButton open-type="share">分享链接</CwButton>
      </div>
    </div>
  </StickyScroll>
</template>

<style lang="scss">
  // 海报图
  .invite-poster {
    width: 100%;
    height: var(--height);
    position: fixed;
    left: -9909rpx;
  }

  // 邀请页面
  .invite {
    position: relative;
    overflow: hidden;
    padding: 0 32rpx var(--cw-padding-bottom) 32rpx;
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
            no-repeat center / cover;
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
    }
  }
</style>
