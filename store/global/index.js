import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 全局变量
 */
export const useGlobalStore = defineStore('global', () => {
  /**
   * 胶囊配置
   */
  const headerBtnPosi = ref(0)
  /**
   * 顶栏高度
   */
  const navBarHeight = ref(0)

  // #ifdef MP-WEIXIN

  // 顶部菜单栏高度
  const systemInfo = uni.getSystemInfoSync()
  navBarHeight.value = systemInfo.statusBarHeight + 44
  console.log('顶部菜单栏高度', navBarHeight.value)

  // 胶囊配置
  headerBtnPosi.value = uni.getMenuButtonBoundingClientRect()
  console.log('胶囊配置', headerBtnPosi.value)
  // #endif

  // #ifdef H5
  // 顶部菜单栏高度
  navBarHeight.value = 98

  // 胶囊配置
  headerBtnPosi.value = { bottom: 90, height: 32, left: 336, right: 423, top: 58, width: 87 }
  // #endif

  return { navBarHeight, headerBtnPosi }
})