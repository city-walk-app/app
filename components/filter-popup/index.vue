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
    <div class="filter-popup-wrapper"></div>
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

    .filter-popup-mask {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: skyblue;
    }

    .filter-popup-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 45%;
      background-color: red;
      z-index: 100;
    }
  }
</style>
