<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import StickyScroll from '@/components/sticky-scroll'
  import Empty from '@/components/empty'
  import { DEFAULT_AVATAR } from '@/enum'

  const API = new Api()

  /** 朋友列表 */
  const friends = ref()
  /** 是否正在加载朋友列表 */
  const friendsLoading = ref(true)

  /**
   * 获取朋友列表
   */
  const friendList = async () => {
    friendsLoading.value = true

    const res = await API.friendList()

    friendsLoading.value = false

    if (res.code === 200) {
      friends.value = res.data
    }
  }

  friendList() // 获取朋友列表
</script>

<template>
  <StickyScroll title="我的朋友">
    <div class="friends">
      <!-- 朋友列表-加载中 -->
      <div class="body" v-if="friendsLoading">
        <div class="body-item" v-for="i in 4" :key="i">
          <div
            class="cw-skeleton-animated body-item-avatar-wrapper__skeleton"
          />
          <div class="cw-skeleton-animated body-item-name__skeleton" />
        </div>
      </div>

      <!-- 朋友列表-加载完成 -->
      <template v-else>
        <!-- 朋友列表-有数据 -->
        <div class="body" v-if="friends && friends.length">
          <div class="body-item" v-for="(item, index) in friends" :key="index">
            <!-- 头像 -->
            <div class="body-item-avatar-wrapper">
              <image
                mode="aspectFill"
                class="body-item-avatar"
                :src="item.avatar || DEFAULT_AVATAR"
              />
            </div>
            <!-- 名字 -->
            <div class="body-item-name">{{ item.nick_name || '' }}</div>
          </div>
        </div>

        <!-- 朋友列表-没有朋友 -->
        <div v-else class="body-empty">
          <Empty title="居然一个朋友都没有" />
        </div>
      </template>
    </div>
  </StickyScroll>
</template>

<style lang="scss">
  .friends {
    padding: 46rpx 32rpx;
    box-sizing: border-box;

    // 朋友列表
    .body {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 40rpx;
      column-gap: 24rpx;
      margin-top: 40rpx;

      .body-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 24rpx;

        // 头像容器
        .body-item-avatar-wrapper__skeleton {
          width: 212rpx;
          height: 212rpx;
          flex-shrink: 0;
          border-radius: 44rpx;
          flex-shrink: 0;
          background-color: var(--cw-skeleton-background-light);
        }

        // 头像容器
        .body-item-avatar-wrapper {
          width: 212rpx;
          height: 212rpx;
          flex-shrink: 0;
          border-radius: 44rpx;
          flex-shrink: 0;
          background-color: var(--cw-skeleton-background-light);

          .body-item-avatar {
            width: inherit;
            height: inherit;
            border-radius: inherit;
          }
        }

        // 名字骨架图
        .body-item-name__skeleton {
          width: 84rpx;
          height: 40rpx;
          background-color: var(--cw-skeleton-background-light);
        }

        // 名字
        .body-item-name {
          height: 40rpx;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          line-height: 33rpx;
        }
      }
    }
  }
</style>
