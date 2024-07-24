<script setup>
  import { useGlobalStore } from '@/store'
  import { ref } from 'vue'

  defineProps({
    title: {
      type: String,
      required: true,
    },
  })
  const useGlobal = useGlobalStore()

  /**
   * 返回
   */
  const back = () => {
    uni.navigateBack({ delta: 1 })
  }

  const styleDiff = ref(0)
  const startSize = ref(56)
  const endSize = ref(34)

  /**
   * 页面滚动
   */
  const scroll = (evt) => {
    const marginTop = useGlobal.navBarHeight + 16 - useGlobal.headerBtnPosi.top
    const diff = evt.detail.scrollTop / marginTop
    const diffFormat = parseFloat(diff.toFixed(2))

    if (diffFormat >= 1) {
      styleDiff.value = 1
    } else {
      styleDiff.value = diffFormat
    }

    console.log(
      '字体大小',
      startSize.value + (endSize.value - startSize.value) * styleDiff.value
    )
    console.log(startSize.value, endSize.value, styleDiff.value)
  }
</script>

<template>
  <scroll-view
    class="sticky-scroll"
    :scroll-x="false"
    scroll-y
    @scroll="scroll"
  >
    <div
      class="sticky-scroll-main"
      :style="{ marginTop: useGlobal.navBarHeight + 16 + 'px' }"
    >
      <!-- 顶部菜单 -->
      <div
        class="sticky-scroll-navigation-bar"
        :style="{
          height: useGlobal.navBarHeight + 'px',
          opacity: styleDiff,
        }"
      />

      <!-- 头部操作 -->
      <div
        class="sticky-scroll-header"
        :style="{
          top: useGlobal.headerBtnPosi.top + 'px',
        }"
      >
        <!-- 返回按钮 -->
        <div class="back" @click="back">
          <image class="back-icon" src="/assets/svg/left.svg" />
        </div>
        <div
          class="title"
          :style="{
            fontSize: startSize + (endSize - startSize) * styleDiff + 'rpx',
          }"
        >
          {{ title }}
        </div>
      </div>

      <slot />
    </div>
  </scroll-view>
</template>

<style lang="scss">
  .sticky-scroll {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    position: relative;

    .sticky-scroll-main {
      box-sizing: border-box;

      // 顶部栏
      .sticky-scroll-navigation-bar {
        width: 100vw;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        backdrop-filter: blur(10px);
        z-index: 5;
      }

      // 头部
      .sticky-scroll-header {
        display: flex;
        align-items: center;
        column-gap: 32rpx;
        position: sticky;
        z-index: 50;
        padding: 0 32rpx;
        box-sizing: border-box;

        .title {
          font-family: Douyin Sans, Douyin Sans;
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

          .back-icon {
            width: 50rpx;
            height: 50rpx;
            flex-shrink: 0;
          }
        }
      }
    }
  }
</style>
