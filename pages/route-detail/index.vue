<script setup>
  import { Api } from '@/api'
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'

  const API = new Api()

  const userInfo = ref(getStorage(USER_INFO))
  /** 步行详情 */
  const routeDetail = ref()

  /**
   * 获取用户步行记录列表
   */
  const getUserRouteDetail = async (list_id) => {
    try {
      const res = await API.getUserRouteDetail({
        list_id,
        user_id: userInfo.value.user_id,
      })

      if (res.code === 200) {
        routeDetail.value = res.data
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  onLoad((options) => {
    console.log(options)
    getUserRouteDetail(options.list_id) // 获取用户步行记录列表
  })
</script>

<template>
  <div class="route-detail">
    <template v-if="routeDetail && routeDetail.length">
      <div v-for="(item, index) in routeDetail" :key="index">
        {{ item.province }} {{ item.city }}
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  .route-detail {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;

    .map {
      width: 100vw;
      height: 100vh;
    }
  }
</style>
