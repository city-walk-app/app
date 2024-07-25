<script lang="ts" setup>
  const prop = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  })
</script>

<template>
  <div class="filter-popup">
    <!-- 遮罩层 -->
    <div class="filter-popup-mask"></div>

    <!-- 内容容器 -->
    <div class="filter-popup-wrapper">
      <div class="filter-popup-gradient-blur">
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-1"
        ></div>
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-2"
        ></div>
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-3"
        ></div>
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-4"
        ></div>
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-5"
        ></div>
        <div
          class="filter-popup-gradient-blur-item filter-popup-gradient-blur-item-6"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
        position: fixed;
        z-index: 5;
        inset: auto 0 0 0;
        height: 65%;
        pointer-events: none;

        & > div,
        &::before,
        &::after {
          position: absolute;
          inset: 0;
        }

        &::before {
          content: '';
          z-index: 100;
          backdrop-filter: blur(0.5px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 12.5%,
            rgba(0, 0, 0, 1) 25%,
            rgba(0, 0, 0, 0) 37.5%
          );
        }

        .filter-popup-gradient-blur-item {
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          left: 0;
          bottom: 0;
        }

        .filter-popup-gradient-blur-item-1 {
          z-index: 200;
          backdrop-filter: blur(1px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 12.5%,
            rgba(0, 0, 0, 1) 25%,
            rgba(0, 0, 0, 1) 37.5%,
            rgba(0, 0, 0, 0) 50%
          );
        }

        .filter-popup-gradient-blur-item-2 {
          z-index: 300;
          backdrop-filter: blur(2px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 25%,
            rgba(0, 0, 0, 1) 37.5%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0) 62.5%
          );
        }

        .filter-popup-gradient-blur-item-3 {
          z-index: 400;
          backdrop-filter: blur(4px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 37.5%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 1) 62.5%,
            rgba(0, 0, 0, 0) 75%
          );
        }

        .filter-popup-gradient-blur-item-4 {
          z-index: 500;
          backdrop-filter: blur(8px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 1) 62.5%,
            rgba(0, 0, 0, 1) 75%,
            rgba(0, 0, 0, 0) 87.5%
          );
        }

        .filter-popup-gradient-blur-item-5 {
          z-index: 600;
          backdrop-filter: blur(16px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 62.5%,
            rgba(0, 0, 0, 1) 75%,
            rgba(0, 0, 0, 1) 87.5%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .filter-popup-gradient-blur-item-6 {
          z-index: 700;
          backdrop-filter: blur(32px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 75%,
            rgba(0, 0, 0, 1) 87.5%,
            rgba(0, 0, 0, 1) 100%
          );
        }

        &::after {
          content: '';
          z-index: 800;
          backdrop-filter: blur(64px);
          mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 87.5%,
            rgba(0, 0, 0, 1) 100%
          );
        }
      }
    }
  }
</style>
