<script setup>
  defineProps({
    /**
     * 展示状态
     */
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    /**
     * 位置
     */
    position: {
      type: String,
      default: 'center',
      validator: (value) => ['center', 'right'].includes(value),
    },
  })
</script>

<template>
  <div v-if="visible" class="city-dialog">
    <!-- 遮罩层 -->
    <div class="city-dialog__mask" />

    <!-- 主容器 -->
    <div :class="['city-dialog__wrapper', `city-dialog__wrapper-${position}`]">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .city-dialog {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;

    // 遮罩层
    &__mask {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
    }

    // 容器
    &__wrapper {
      overflow: auto;
      background: #fff;
      position: relative;
      padding: 20px;
      box-sizing: border-box;

      // 居中显示
      &.city-dialog__wrapper-center {
        width: 80%;
        border-radius: 20px;
        max-height: 900px;
      }

      // 右侧弹出
      &.city-dialog__wrapper-right {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 50vw;
      }
    }
  }
</style>
