<script setup>
  const prop = defineProps({
    route: Object,
    index: Number,
  })

  /**
   * 查看步行记录详情
   */
  const routeDetail = (id) => {
    uni.navigateTo({
      url: `/pages/route-detail/index?id=${id}`,
    })
  }

  /**
   * 计算步行数量的类名
   */
  const getItemRightStyle = (routers) => {
    if (routers <= 5) {
      return 'item-icon-1'
    } else if (routers > 5 && routers <= 10) {
      return 'item-icon-2'
    }
    return 'item-icon-3'
  }
</script>

<template>
  <div class="route-item" :key="index" @click="routeDetail(route.id)">
    <div :class="['item-icon', getItemRightStyle(route.route_detail)]">
      <i class="city-icon icon-walk" />
    </div>

    <!-- 主要内容 -->
    <div class="item-content">
      <div class="item-content-title">打卡{{ route.route_detail }}个位置</div>
      <div class="item-content-city">{{ route.city }}</div>
    </div>
  </div>
</template>

<style lang="scss">
  // 每一项
  .route-item {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    padding: 9px 21px;
    background-color: #f3f7fa;
    box-sizing: border-box;
    border-radius: 22px;

    // icon
    .item-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.item-icon-1 {
        background: green;
      }

      &.item-icon-2 {
        background: blue;
      }

      &.item-icon-3 {
        background: red;
      }

      .city-icon {
        font-size: 28px;
        color: #fff;
      }
    }

    // 内容
    .item-content {
      margin-left: 15px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-title {
        color: #111;
        font-size: 18px;
      }

      &-city {
        color: #373737;
        font-size: 14px;
      }
    }
  }
</style>
