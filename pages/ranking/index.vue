<script setup>
  import { ref } from 'vue'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'

  const API = new Api()

  /** 排名列表 */
  const rankingList = ref()

  /**
   * 获取朋友经验排名
   */
  const getFriendExperienceRanking = async () => {
    const res = await API.getFriendExperienceRanking()

    if (res.code === 200) {
      rankingList.value = res.data
    }
  }

  const goUserMain = (user_id) => {
    uni.navigateTo({
      url: `/pages/mine/index?user_id=${user_id}`,
    })
  }

  getFriendExperienceRanking() // 获取朋友经验排名
</script>

<template>
  <div class="friends">
    <div class="header">
      <h1>排行榜</h1>
      <template v-if="rankingList && rankingList.length">
        <div
          v-for="(item, index) in rankingList"
          :key="index"
          @click="goUserMain(item.user_id)"
        >
          {{ item.nick_name }} 经验值：{{ item.experiences }}地点数：{{
            item.count
          }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss"></style>
