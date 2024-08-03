<script setup>
  defineProps({
    type: String,
    block: Boolean,
    openType: String,
    width: String,
    height: String,
    radius: String,
  })
  const emit = defineEmits(['click'])

  /**
   * 点击事件
   */
  const handleClick = (evt) => {
    emit('click', evt)
  }
</script>

<template>
  <button
    :open-type="openType"
    :class="[
      'cw-button',
      {
        [`cw-button-${type}`]: type,
        'cw-button-block': block,
      },
    ]"
    :style="{
      '--width': width || '320rpx',
      '--height': height || '96rpx',
      '--radius': radius || '28rpx',
    }"
    :hover-class="`cw-button-hover-${type || 'default'}`"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style lang="scss">
  .cw-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--width);
    height: var(--height);
    padding: 0;
    margin: 0;
    border-radius: var(--radius);
    border: 3rpx solid var(--cw-theme-1);
    font-weight: 400;
    font-size: 32rpx;
    background: var(--cw-theme-1);
    line-height: 38rpx;
    color: #fff;
    transition: background 0.12s, transform 0.12s, border-color 0.12s;

    // 线性的
    &.cw-button-line {
      background-color: #fff;
      color: var(--cw-theme-1);
      border: 3rpx solid var(--cw-theme-1);
    }

    // 块级的
    &.cw-button-block {
      width: 100%;
    }

    // 点击触发
    &.cw-button-hover-line {
      border-color: #f1754f;
      transform: scale(0.97);
    }

    // 点击触发
    &.cw-button-hover-default {
      background-color: #f1754f;
      border-color: #f1754f;
      transform: scale(0.97);
    }
  }
</style>
