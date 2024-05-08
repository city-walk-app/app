<script setup>
  import { VUE_APP_API_URL } from '@/utils'
  import { Api } from '@/api'
  import { ref } from 'vue'
  import CityRoute from '@/components/city-route/index.vue'

  const API = new Api()

  /** 用户打卡历史记录列表 */
  const routeHistoryList = ref([])

  /**
   * 获取用户步行记录
   */
  const getRouteList = async () => {
    const res = await API.getRouteList({ page: 1, page_size: 30 })

    if (res.code === 200) {
      routeHistoryList.value = res.data
    }
  }

  getRouteList()
</script>

<template>
  <div class="route-history">
    <div
      class="header"
      :style="{
        background: `url('${VUE_APP_API_URL}/images/assets/6.jpg') no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    ></div>

    <div class="body">
      <!-- 数据列表 -->
      <template v-if="routeHistoryList && routeHistoryList.length">
        <CityRoute
          v-for="(item, index) in routeHistoryList"
          :key="index"
          :route="item"
        />
      </template>
      <!-- 没有数据 -->
      <div v-else class="body-nodate">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss">
  .route-history {
    width: 100vw;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;

    // 头部 banner
    .header {
      width: 100vw;
      height: 80vw;
    }

    // 打卡记录列表
    .body {
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      background-color: #fff;
      border-radius: 24px 24px 0 0;
      padding: 30px 20px 30px 20px;
      box-sizing: border-box;
      position: relative;
      margin-top: -44rpx;
      padding-bottom: 99px;

      // 没有数据
      .body-nodate {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        padding: 50px;
        box-sizing: border-box;
      }
    }
  }
</style>
