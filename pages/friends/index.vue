<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()

  /** 朋友列表 */
  const friends = ref()

  /**
   * 获取朋友列表
   */
  const friendList = async () => {
    const res = await API.friendList()

    if (res.code === 200) {
      friends.value = res.data
    }
  }

  friendList() // 获取朋友列表
</script>

<template>
  <StickyScroll title="我的朋友"></StickyScroll>
  <!-- <div class="friends">
    <div class="header">
      <h1>我的朋友</h1>
      <template v-if="friends && friends.length">
        <div v-for="(item, index) in friends" :key="index">
          {{ item.nick_name }}
        </div>
      </template>
    </div>
  </div> -->
</template>

<style lang="scss"></style>
