<script setup>
  import { ref } from 'vue'

  const prop = defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
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
      @click="close"
    >
      <div>对话框内容</div>
      <div>对话框内容</div>
      <div>对话框内容</div>
      <div>对话框内容</div>
      <div>对话框内容</div>
      <div>对话框内容</div>
    </div>
  </div>
</template>

<style lang="scss">
  .sheet {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #333;

    .sheet-wrapper {
      width: inherit;
      height: inherit;
      overflow-y: auto;
      background-color: #fff;
      transform: scale(1) translateY(0);
      transition: transform 0.24s;

      &.shee-wrapper-open {
        transform: scale(0.9) translateY(-30px);
        border-radius: 15px;
      }
    }

    .sheet-dialog {
      height: 97vh;
      transform: translateY(97vh);
      transition: transform 0.24s;
      width: 100vw;
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: #fff;
      z-index: 600;
      padding: 40px 32px;
      box-sizing: border-box;
      border-radius: 15px 15px 0 0;

      &.shee-dialog-open {
        transform: translateY(0);
      }
    }
  }
</style>
