<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import StickyScroll from '@/components/sticky-scroll'
  import Empty from '@/components/empty'
  import { DEFAULT_AVATAR } from '@/enum'
  import { toast } from '@/utils'

  const API = new Api()

  /** 排名列表 */
  const rankingList = ref()
  /** 排名列表是否在加载中 */
  const rankingListLoading = ref(true)

  /**
   * 获取朋友经验排名
   */
  const getFriendExperienceRanking = async () => {
    try {
      rankingListLoading.value = true

      const res = await API.getFriendExperienceRanking()

      rankingListLoading.value = false

      if (res.code === 200) {
        rankingList.value = res.data
        return
      }

      toast(res.message)
    } catch (err) {
      console.log('接口异常', err)

      rankingListLoading.value = false
    }
  }

  /**
   * 跳转用户首页
   */
  const goUserMain = (user_id) => {
    if (!user_id) {
      return
    }

    uni.navigateTo({
      url: `/pages/mine/index?user_id=${user_id}`,
    })
  }

  getFriendExperienceRanking() // 获取朋友经验排名
</script>

<template>
  <StickyScroll title="排行榜">
    <!-- 排行榜-加载中 -->
    <div class="ranking" v-if="rankingListLoading">
      <div
        class="cw-skeleton-animated ranking-item__skeleton"
        v-for="i in 4"
        :key="i"
      >
        <!-- 名次 -->
        <div class="ranking-item-count__skeleton" />

        <!-- 头像 -->
        <div
          class="cw-skeleton-animated ranking-item-avatar-wrapper__skeleton"
        />

        <!-- 信息 -->
        <div class="ranking-item-info__skeleton">
          <div class="cw-skeleton-animated ranking-item-info-name__skeleton" />
          <div
            class="cw-skeleton-animated ranking-item-info-content__skeleton"
          />
        </div>
      </div>
    </div>

    <!-- 排行榜-加载完成 -->
    <template v-else>
      <!-- 排行榜-有数据 -->
      <div class="ranking" v-if="rankingList && rankingList.length">
        <div
          v-for="(item, index) in rankingList"
          :key="index"
          :class="['ranking-item', { 'ranking-item-first': index === 0 }]"
          @click="goUserMain(item.user_id)"
        >
          <!-- 名次 -->
          <div class="ranking-item-count">
            <image
              v-if="index === 0"
              class="ranking-item-count-icon"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/ranking-1.svg"
            />
            <image
              v-else-if="index === 1"
              class="ranking-item-count-icon"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/ranking-2.svg"
            />
            <image
              v-else-if="index === 2"
              class="ranking-item-count-icon"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/ranking-3.svg"
            />
            <div v-else class="ranking-item-count-text">{{ index + 1 }}</div>
          </div>

          <!-- 头像 -->
          <div class="ranking-item-avatar-wrapper">
            <!-- 皇冠 -->
            <image
              v-if="index === 0"
              class="ranking-item-avatar-crown"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/ranking-crown.png"
            />

            <!-- 头像 -->
            <image
              class="ranking-item-avatar"
              mode="aspectFill"
              :src="item.avatar || DEFAULT_AVATAR"
            />
          </div>

          <!-- 信息 -->
          <div class="ranking-item-info">
            <div class="ranking-item-info-name">{{ item.name }}</div>
            <div class="ranking-item-info-content">
              今日共打卡
              <div class="ranking-item-info-count" v-if="item.count">
                {{ item.count }}
              </div>
              <template v-else>{{ item.count }}</template>
              个地点
            </div>
          </div>

          <!-- 经验值 -->
          <div class="ranking-item-num">{{ item.experiences }}</div>
        </div>
      </div>

      <!-- 排行榜-没有数据 -->
      <div v-else class="ranking-empty">
        <Empty title="暂无数据" />
      </div>
    </template>
  </StickyScroll>
</template>

<style lang="scss">
  // 排行榜
  .ranking {
    padding: 46rpx 32rpx 32rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    row-gap: 40rpx;

    // 骨架屏
    .ranking-item__skeleton {
      width: 100%;
      height: 160rpx;
      position: relative;
      flex-shrink: 0;
      box-shadow: 0rpx 2rpx 11rpx 0rpx rgba(186, 186, 186, 0.2);
      border-radius: 16rpx;
      border: 2rpx solid;
      border-image: linear-gradient(
          162deg,
          rgba(255, 255, 255, 1),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        )
        2 2;
      padding: 34rpx 30rpx 34rpx 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background-color: var(--cw-skeleton-background-light);

      // 名次
      .ranking-item-count__skeleton {
        width: 50rpx;
        height: 56rpx;
        flex-shrink: 0;
        background-color: transparent;
      }

      // 头像
      .ranking-item-avatar-wrapper__skeleton {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        flex-shrink: 0;
        margin-left: 24rpx;
        background-color: var(--cw-skeleton-background-dark);
      }

      // 信息
      .ranking-item-info__skeleton {
        display: flex;
        margin-left: 28rpx;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1;
        row-gap: 14rpx;

        .ranking-item-info-name__skeleton {
          width: 86rpx;
          height: 44rpx;
          background-color: var(--cw-skeleton-background-dark);
        }

        .ranking-item-info-content__skeleton {
          width: 254rpx;
          height: 40rpx;
          background-color: var(--cw-skeleton-background-dark);
        }
      }
    }

    .ranking-item {
      width: 100%;
      height: 160rpx;
      position: relative;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0rpx 2rpx 11rpx 0rpx rgba(186, 186, 186, 0.2);
      border-radius: 16rpx;
      border: 2rpx solid;
      border-image: linear-gradient(
          162deg,
          rgba(255, 255, 255, 1),
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        )
        2 2;
      padding: 34rpx 30rpx 34rpx 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      // 第一个
      &.ranking-item-first {
        background: linear-gradient(93deg, #f6e6c3 0%, #fbf5ee 100%);
        box-shadow: 0rpx 2rpx 11rpx 0rpx rgba(186, 186, 186, 0.2);
        border: 2rpx solid;
        border-image: linear-gradient(
            162deg,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          )
          2 2;
      }

      // 名次
      .ranking-item-count {
        width: 50rpx;
        height: 56rpx;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .ranking-item-count-text {
          font-weight: 400;
          font-size: 32rpx;
          color: #333;
          line-height: 38rpx;
        }

        .ranking-item-count-icon {
          width: inherit;
          height: inherit;
        }
      }

      // 头像
      .ranking-item-avatar-wrapper {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        flex-shrink: 0;
        margin-left: 24rpx;
        position: relative;

        // 皇冠
        .ranking-item-avatar-crown {
          width: 50rpx;
          height: 50rpx;
          flex-shrink: 0;
          position: absolute;
          top: -25rpx;
          right: -10rpx;
          z-index: 20;
        }

        // 头像
        .ranking-item-avatar {
          width: inherit;
          height: inherit;
          border-radius: inherit;
        }
      }

      .ranking-item-info {
        display: flex;
        margin-left: 28rpx;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1;
        row-gap: 14rpx;

        // 昵称
        .ranking-item-info-name {
          font-weight: 400;
          font-size: 32rpx;
          height: 44rpx;
          display: flex;
          align-items: center;
          color: #333;
          line-height: 38rpx;
        }

        // 文案
        .ranking-item-info-content {
          font-weight: 400;
          font-size: 28rpx;
          height: 40rpx;
          color: #9a9a9a;
          line-height: 33rpx;
          display: flex;
          align-items: center;

          .ranking-item-info-count {
            font-weight: 400;
            font-size: 28rpx;
            color: #f3943f;
            line-height: 33rpx;
          }
        }
      }

      // 经验值
      .ranking-item-num {
        font-weight: 500;
        font-size: 60rpx;
        color: #f8d035;
        line-height: 70rpx;
        position: absolute;
        top: 16rpx;
        right: 32rpx;
      }
    }
  }

  // 暂无数据
  .ranking-empty {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
