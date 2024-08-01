<script setup>
  import { useGlobalStore } from '@/store'

  const useGlobal = useGlobalStore()

  const prop = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
    title: String,
  })
  const emit = defineEmits(['on-close'])

  const close = () => {
    emit('on-close')
  }
</script>

<template>
  <div :class="['sheet']">
    <!-- 容器，存放内容 -->
    <div :class="['sheet-wrapper', { 'shee-wrapper-open': visible }]">
      <slot />
    </div>

    <!-- 对话框内容 -->
    <div
      :class="['sheet-dialog', { 'shee-dialog-open': visible }]"
      :style="{
        height: `calc(100vh - ${
          useGlobal.headerBtnPosi.top +
          useGlobal.headerBtnPosi.height +
          5 +
          'px'
        })`,
      }"
    >
      <div class="sheet-dialog-header">
        <div class="sheet-dialog-header-title">{{ title || '' }}</div>

        <div class="sheet-dialog-header-close" @click="close">
          <image
            class="sheet-dialog-header-close-icon"
            src="/assets/svg/close.svg"
          />
        </div>
      </div>

      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss">
  .sheet {
    width: 100vw;
    height: 100vh;
    position: relative;
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

    .sheet-dialog {
      transform: translateY(97vh);
      transition: transform 0.24s;
      width: 100vw;
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: #fff;
      z-index: 600;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-radius: 19rpx 19rpx 0 0;

      // 头部
      .sheet-dialog-header {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 34rpx;
        box-sizing: border-box;

        .sheet-dialog-header-title {
          height: 42rpx;
          display: flex;
          align-items: center;
        }

        .sheet-dialog-header-close {
          width: 60rpx;
          height: 60rpx;
          background-color: #eee;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 34rpx;
          top: 34rpx;

          .sheet-dialog-header-close-icon {
            width: 40rpx;
            height: 40rpx;
            flex-shrink: 0;
          }
        }
      }

      &.shee-dialog-open {
        transform: translateY(0);
      }
    }
  }
</style>
