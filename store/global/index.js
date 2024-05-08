import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 全局变量
 */
export const useGlobalStore = defineStore('global', () => {
  /** 顶部菜单栏高度 */
  const statusBarHeight = ref(0)

  // #ifdef MP-WEIXIN
  const systemInfo = uni.getSystemInfoSync()

  statusBarHeight.value = systemInfo.statusBarHeight + 44
  // #endif

  // #ifdef H5
  statusBarHeight.value = 90
  // #endif

  return { statusBarHeight }
})