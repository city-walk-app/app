<script setup>
  defineProps({
    title: String,
  })
</script>

<template>
  <div class="empty">
    <div class="empty-banner" />
    <div class="empty-title">{{ title || '暂无内容' }}</div>
  </div>
</template>

<style lang="scss">
  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60rpx 32rpx;
    box-sizing: border-box;

    .empty-banner {
      width: 398rpx;
      height: 374rpx;
      background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/empty.png')
        no-repeat center / cover;
    }

    .empty-title {
      font-weight: 400;
      font-size: 32rpx;
      color: #9a9a9a;
      line-height: 38rpx;
      margin-top: 24rpx;
    }
  }
</style>
