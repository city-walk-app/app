<script setup>
  import { VUE_APP_API_URL, getStorage } from '@/utils'
  import { ref } from 'vue'
  import { Api } from '@/api'
  import { USER_PROVINCE_CODE } from '@/enum'

  const API = new Api()

  /** 缓存的当前省份信息 */
  const provinceInfoStorage = getStorage(USER_PROVINCE_CODE)

  /** 经验列表 */
  const rankingList = ref([])

  /**
   * 跳转用户首页
   */
  const goUserHome = (id) => {
    // uni.navigateTo({
    //   url: `/pages/user/index?id=${id}`,
    // })
  }

  /**
   * 获取排行榜信息
   */
  const getRanking = async () => {
    const res = await API.getRanking({
      // province_code: provinceInfoStorage.province_code || 330000,
      province_code: provinceInfoStorage.province_code,
    })

    if (res.code === 200) {
      rankingList.value = res.data
    }
  }

  getRanking() // 获取排行榜信息
</script>

<template>
  <div class="ranking">
    <!-- 头部 -->
    <div
      class="header"
      :style="{
        background: `url('${VUE_APP_API_URL}/images/assets/5.jpg') no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div v-if="rankingList && rankingList.length" class="toping">
        <div class="top-item">
          <image
            v-if="rankingList[1]"
            class="top-item-avatar"
            :src="VUE_APP_API_URL + rankingList[1].user_info.avatar"
            mode="aspectFill"
          />
          <div class="top-item-bar">
            <div class="top-item-bar-num">2</div>
          </div>
        </div>
        <div class="top-item">
          <image
            v-if="rankingList[0]"
            class="top-item-avatar"
            :src="VUE_APP_API_URL + rankingList[0].user_info.avatar"
            mode="aspectFill"
          />
          <div class="top-item-bar">
            <div class="top-item-bar-num">1</div>
          </div>
        </div>
        <div class="top-item">
          <image
            v-if="rankingList[2]"
            class="top-item-avatar"
            :src="VUE_APP_API_URL + rankingList[2].user_info.avatar"
            mode="aspectFill"
          />
          <div class="top-item-bar">
            <div class="top-item-bar-num">3</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="body">
      <!-- 列表内容 -->
      <template v-if="rankingList && rankingList.length">
        <div
          class="ranking-item"
          v-for="(item, index) in rankingList"
          :key="index"
          @click="goUserHome(item.user_id)"
        >
          <!-- 名次 -->
          <div class="user-rank">{{ index + 1 }}</div>

          <!-- 容器 -->
          <div class="user-wrapper">
            <!-- 用户信息 -->
            <div class="user-info-wrapper" v-if="item.user_info">
              <image
                mode="aspectFill"
                class="user-avatar"
                :src="VUE_APP_API_URL + item.user_info.avatar"
              />

              <!-- 用户信息 -->
              <div class="user-info">
                <!-- 昵称 -->
                <div class="user-nick-name">{{ item.user_info.nick_name }}</div>

                <!-- 星星数量 -->
                <div class="user-stars">
                  <i class="city-icon icon-xingxing1" />
                  <div class="user-star-num">300</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 没有数据 -->
      <div v-else class="body-nodate">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss">
  .ranking {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;

    // 头部
    .header {
      width: 100vw;
      height: 80vw;
      position: relative;

      .toping {
        padding: 0 40px 0 40px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
        position: absolute;
        justify-content: center;
        column-gap: 19px;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;

        .top-item {
          width: 69px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          row-gap: 10px;
        }

        .top-item:nth-child(1) .top-item-bar {
          height: 90px;
          background-color: rgb(159, 79, 54);
        }

        .top-item:nth-child(2) .top-item-bar {
          height: 120px;
          background-color: rgb(89, 55, 74);
        }

        .top-item:nth-child(3) .top-item-bar {
          height: 70px;
          background-color: rgb(212, 119, 0);
        }

        .top-item-bar {
          width: 100%;
          padding-top: 12px;
          box-sizing: border-box;
          border-radius: 16px 16px 0 0;
          display: flex;
          justify-content: center;

          // 数字
          .top-item-bar-num {
            color: #fff;
            font-weight: bold;
            font-size: 20px;
          }
        }

        .top-item-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
    }

    // 列表
    .body {
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      background: #fff;
      border-radius: 24px 24px 0 0;
      padding: 30px 20px 30px 0;
      box-sizing: border-box;
      position: relative;
      margin-top: -44rpx;
      padding-bottom: 99px;

      // 每一项
      .ranking-item {
        display: flex;
        align-items: center;

        // 名次
        .user-rank {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: bold;
          flex-shrink: 0;
          width: 68px;
          color: rgb(25, 17, 19);
        }

        // 用户容器
        .user-wrapper {
          background-color: #f3f7fa;
          padding: 20px 25px;
          flex: 1;
          box-sizing: border-box;
          border-radius: 22px;
          display: flex;

          // 信息
          .user-info-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            // 头像
            .user-avatar {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              margin-right: 10px;
              flex-shrink: 0;
            }

            // 用户信息
            .user-info {
              flex: 1;

              // 昵称
              .user-nick-name {
                font-size: 18px;
                color: #333;
              }

              // 星星
              .user-stars {
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }

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
