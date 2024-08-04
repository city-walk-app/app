<script setup>
  import { useGlobalStore } from '@/store'
  import { ref } from 'vue'

  const prop = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    title: String,
    bottom: Number,
    isMoveClose: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['on-close'])

  const useGlobal = useGlobalStore()

  /** 是否显示空的标签实现点击空白处关闭 */
  const isShowCloseEmpty = ref(prop.visible)
  /** 记录触摸起始位置 */
  const startY = ref(0)
  /** 是否在拖动 */
  const isDragging = ref(false)

  /**
   * 关闭事件
   */
  const close = () => {
    startY.value = 0
    isDragging.value = false
    // isShowCloseEmpty.value = false

    emit('on-close')
  }

  /**
   * 动画结束触发
   */
  const transitionend = () => {
    // if (prop.visible) {
    isShowCloseEmpty.value = prop.visible
    // }
  }

  /**
   * 下滑开始
   */
  const handleTouchStart = (evt) => {
    if (!prop.isMoveClose) {
      return
    }

    console.log('start')
    startY.value = evt.touches[0].clientY
    isDragging.value = true
  }

  /**
   * 下滑中
   */
  const handleTouchMove = (evt) => {
    if (!prop.isMoveClose) {
      return
    }

    console.log('move')
    if (!isDragging.value) return

    const currentY = evt.touches[0].clientY
    const deltaY = currentY - startY.value

    // 判断下滑距离
    if (deltaY > 100) {
      close() // 关闭
    }
  }

  /**
   * 下滑结束
   */
  const handleTouchEnd = () => {
    if (!prop.isMoveClose) {
      return
    }

    console.log('End')
    isDragging.value = false
  }
</script>

<template>
  <div class="sheet">
    <!-- 容器，存放内容 -->
    <div :class="['sheet-wrapper', { 'shee-wrapper-open': visible }]">
      <slot />
    </div>

    <!-- 空的标签实现点击空白处关闭 -->
    <div
      v-if="isShowCloseEmpty"
      class="sheet-close-empty-header"
      :style="{
        '--height': `${
          useGlobal.headerBtnPosi.top +
          useGlobal.headerBtnPosi.height +
          5 +
          'px'
        }`,
      }"
      @click="close"
    />

    <!-- 底部占位元素 -->
    <div
      v-if="isShowCloseEmpty && bottom"
      class="sheet-close-empty-body"
      :style="{
        '--height': `${
          useGlobal.headerBtnPosi.top +
          useGlobal.headerBtnPosi.height +
          5 +
          'px'
        }`,
      }"
    />

    <!-- 对话框内容 -->
    <div
      :class="['sheet-dialog', { 'shee-dialog-open': visible }]"
      :style="{
        '--height': `calc(100vh - ${
          useGlobal.headerBtnPosi.top +
          useGlobal.headerBtnPosi.height +
          5 +
          'px'
        })`,
        '--bottom': bottom ? bottom + 'px' : 0,
      }"
      @transitionend.self="transitionend"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 头部操作栏 -->
      <div class="sheet-dialog-header">
        <!-- 占位元素 -->
        <div class="sheet-dialog-header-before" />

        <!-- 标题 -->
        <div class="sheet-dialog-header-title">{{ title || '' }}</div>

        <!-- 关闭按钮 -->
        <div class="sheet-dialog-header-close" @click="close">
          <image
            class="sheet-dialog-header-close-icon"
            src="/assets/svg/close.svg"
          />
        </div>
      </div>

      <!-- 身体内容部分 -->
      <div class="sheet-dialog-body">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .sheet {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: #000;

    .sheet-wrapper {
      width: inherit;
      height: inherit;
      overflow-y: auto;
      background-color: #fff;
      transform: scale(1) translateY(0);
      transition: transform 0.24s;

      &.shee-wrapper-open {
        transform: scale(0.9) translateY(30px);
        border-radius: 15px;
      }
    }

    // 空的标签实现点击空白处关闭
    .sheet-close-empty-header {
      height: var(--height);
      background-color: transparent;
      width: 100vw;
      position: fixed;
      z-index: 90;
      top: 0;
      right: 0;
      left: 0;
    }

    // 底部占位元素
    .sheet-close-empty-body {
      height: calc(100vh - var(--height));
      background-color: #fff;
      width: 100vw;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 1;
    }

    // 对话框内容
    .sheet-dialog {
      transform: translateY(97vh);
      transition: transform 0.24s, bottom 0.26s;
      width: 100vw;
      position: absolute;
      right: 0;
      left: 0;
      bottom: var(--bottom);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(25px);
      z-index: 600;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-radius: 19rpx 19rpx 0 0;
      height: var(--height);
      z-index: 40;

      // 头部
      .sheet-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 34rpx;
        box-sizing: border-box;
        flex-shrink: 0;

        .sheet-dialog-header-before {
          width: 60rpx;
          height: 60rpx;
          flex-shrink: 0;
        }

        .sheet-dialog-header-title {
          height: 42rpx;
          display: flex;
          align-items: center;
          font-size: 34rpx;
          line-height: 60rpx;
          color: #333;
          font-weight: 600;
        }

        .sheet-dialog-header-close {
          background-color: #eee;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60rpx;
          height: 60rpx;

          .sheet-dialog-header-close-icon {
            width: 40rpx;
            height: 40rpx;
            flex-shrink: 0;
          }
        }
      }

      // 内容部分
      .sheet-dialog-body {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      &.shee-dialog-open {
        transform: translateY(0);
      }
    }
  }
</style>
