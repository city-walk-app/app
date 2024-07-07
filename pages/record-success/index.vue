<script setup>
  import { ref } from 'vue'
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'

  const API = new Api()
</script>

<template>
  <div class="friends">
    <div class="header">
      <h1>打卡成功</h1>
    </div>
  </div>
</template>

<style lang="scss"></style>
