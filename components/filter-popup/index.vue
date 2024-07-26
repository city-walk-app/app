<script setup>
  const prop = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  })

  console.log('12', prop)
</script>

<template>
  <div v-if="!visible" class="filter-popup">
    <!-- 遮罩层 -->
    <div class="filter-popup-mask" />

    <!-- 内容容器 -->
    <div class="filter-popup-wrapper">
      <!-- 遮罩层背景 -->
      <div class="filter-popup-gradient-blur" />

      <!-- 主要内容 -->
      <div class="filter-popup-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .filter-popup {
    position: fixed;
    z-index: 90;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;

    .filter-popup-mask {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }

    .filter-popup-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 45%;
      z-index: 100;

      .filter-popup-gradient-blur {
        position: absolute;
        z-index: 5;
        inset: 0;

        &::before {
          content: '';
          display: block;
          position: absolute;
          inset: 0;
          mask-image: linear-gradient(0deg, #fff 40%, transparent);
          backdrop-filter: blur(60px);
        }
      }

      // 主要内容
      .filter-popup-body {
        position: absolute;
        z-index: 20;
        inset: 0;
        display: flex;
      }
    }
  }
</style>
