<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()

  /** 排名列表 */
  const rankingList = ref([1, 2, 3, 4, 55, 243, 242, 424, 4, 242, 42, 1])

  /**
   * 获取朋友经验排名
   */
  const getFriendExperienceRanking = async () => {
    const res = await API.getFriendExperienceRanking()

    if (res.code === 200) {
      rankingList.value = res.data
    }
  }

  // const goUserMain = (user_id) => {
  //   uni.navigateTo({
  //     url: `/pages/mine/index?user_id=${user_id}`,
  //   })
  // }

  // getFriendExperienceRanking() // 获取朋友经验排名
</script>

<template>
  <StickyScroll title="排行榜">
    <div class="ranking">
      <div
        v-for="(item, index) in rankingList"
        :key="index"
        :class="['ranking-item', { 'ranking-item-first': index === 0 }]"
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
        <image
          mode="aspectFill"
          class="ranking-item-avatar"
          src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
        />

        <!-- 信息 -->
        <div class="ranking-item-info">
          <div class="ranking-item-info-name">这是吗名字</div>
          <div class="ranking-item-info-content">
            今日共打卡
            <div class="ranking-item-info-count">17</div>
            个地点
          </div>
        </div>

        <!-- 经验值 -->
        <div class="ranking-item-num">1423</div>
      </div>
    </div>
  </StickyScroll>
  <!-- <div class="friends">
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
  </div> -->
</template>

<style lang="scss">
  .ranking {
    padding: 46rpx 32rpx 32rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    row-gap: 40rpx;

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
        background: linear-gradient(93deg, #f7b535 0%, #fff0da 100%);
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
          color: #333333;
          line-height: 38rpx;
        }

        .ranking-item-count-icon {
          width: inherit;
          height: inherit;
        }
      }

      // 头像
      .ranking-item-avatar {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
        flex-shrink: 0;
        margin-left: 24rpx;
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
          color: #333333;
          line-height: 38rpx;
        }

        // 文案
        .ranking-item-info-content {
          font-weight: 400;
          font-size: 28rpx;
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
</style>
