<script setup>
  import { useGlobalStore } from '@/store'
  import { ref } from 'vue'

  defineProps({
    title: {
      type: String,
    },
    titleInfo: {
      type: Object,
    },
  })

  const useGlobal = useGlobalStore()

  /** 样式计算 */
  const styleDiff = ref(0)
  /** 开始的字体大小 */
  const startSize = ref(56)
  /** 结束的字体大小 */
  const endSize = ref(34)

  /**
   * 返回
   */
  const back = () => {
    uni.navigateBack({ delta: 1 })
  }

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
  }
</script>

<template>
  <scroll-view
    class="sticky-scroll"
    scroll-y
    :scroll-x="false"
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
          '--height': useGlobal.navBarHeight + 'px',
          '--opacity': styleDiff,
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

        <!-- 页面标题 -->
        <div v-if="title" class="title-page">
          <div
            class="title"
            :style="{
              fontSize: startSize + (endSize - startSize) * styleDiff + 'rpx',
            }"
          >
            {{ title }}
          </div>
        </div>

        <!-- 信息 -->
        <div
          v-if="titleInfo"
          class="title-info"
          :style="{ opacity: styleDiff >= 1 ? 1 : 0 }"
        >
          <div class="title-info-avatar-wrapper">
            <image
              class="title-info-avatar"
              mode="aspectFill"
              :src="titleInfo.avatar"
            />
          </div>

          <div class="title-info-name">{{ titleInfo.name }}</div>
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
    background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-blank.png')
      no-repeat;

    .sticky-scroll-main {
      box-sizing: border-box;

      // 顶部栏
      .sticky-scroll-navigation-bar {
        width: 100vw;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        mask-image: linear-gradient(
          180deg,
          #fff 0%,
          rgb(255, 255, 255, 0.8) 80%,
          transparent
        );
        backdrop-filter: blur(12px);
        z-index: 5;
        height: var(--height);
        opacity: var(--opacity);
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

        // 页面
        .title-page {
          display: flex;
          align-items: center;

          .title {
            font-weight: bold;
            transition: 0.09s;
            font-size: 56rpx;
            color: #333333;
            line-height: 66rpx;
          }
        }

        // 信息
        .title-info {
          display: flex;
          align-items: center;
          column-gap: 13rpx;
          transition: opacity 0.26s;

          .title-info-avatar-wrapper {
            width: 52rpx;
            height: 52rpx;
            border-radius: 50%;

            .title-info-avatar {
              width: inherit;
              height: inherit;
              border-radius: inherit;
            }
          }

          // 名字
          .title-info-name {
            font-size: 20rpx;
            color: #333333;
            font-size: 28rpx;
            font-weight: 600;
          }
        }

        // 返回
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
