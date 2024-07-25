<script setup>
  import { ref } from 'vue'
  import { Api } from '@/api'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()

  /** 朋友列表 */
  const friends = ref([1, 2, 31, 3, 4, 4, 4, 4, 1, 1, 1, 1, 1])

  /**
   * 获取朋友列表
   */
  const friendList = async () => {
    const res = await API.friendList()

    if (res.code === 200) {
      friends.value = res.data
    }
  }

  // friendList() // 获取朋友列表
</script>

<template>
  <StickyScroll title="我的朋友">
    <div class="friends">
      <!-- 头部待处理的内容 -->
      <div class="header">
        <div class="header-item" v-for="index in 2" :key="index">
          <!-- 左侧信息 -->
          <div class="header-item-left">
            <image
              mode="aspectFill"
              class="header-item-left-avatar"
              src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
            />
            <div class="header-item-left-message">张三申请加你为好友</div>
          </div>

          <!-- 右侧操作 -->
          <div class="header-item-right">
            <div class="header-item-right-no">
              <image class="header-item-right-icon" src="/assets/svg/no.svg" />
            </div>
            <div class="header-item-right-ok">
              <image class="header-item-right-icon" src="/assets/svg/ok.svg" />
            </div>
          </div>
        </div>

        <!-- 查看更多 -->
        <div class="header-footer">
          展开
          <image class="header-footer-icon" src="/assets/svg/left.svg" />
        </div>
      </div>

      <!-- 朋友列表 -->
      <div class="body">
        <div class="body-item" v-for="(item, index) in friends" :key="index">
          <!-- 头像 -->
          <image
            mode="aspectFill"
            class="body-item-avatar"
            src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
          />
          <!-- 名字 -->
          <div class="body-item-name">田同学</div>
        </div>
      </div>
    </div>
  </StickyScroll>
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

<style lang="scss">
  .friends {
    padding: 46rpx 32rpx;
    box-sizing: border-box;

    // 申请列表
    .header {
      width: 100%;
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
      padding: 26rpx 32rpx 16rpx 32rpx;
      box-sizing: border-box;

      .header-item {
        padding-bottom: 28rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;

        // 左侧信息
        .header-item-left {
          display: flex;
          align-items: center;
          column-gap: 32rpx;

          .header-item-left-avatar {
            width: 80rpx;
            height: 80rpx;
            flex-shrink: 0;
            border-radius: 50%;
          }

          .header-item-left-message {
            font-weight: 400;
            font-size: 28rpx;
            color: #333333;
          }
        }

        // 右侧操作
        .header-item-right {
          display: flex;
          align-items: center;
          column-gap: 32rpx;
          justify-content: flex-end;

          .header-item-right-icon {
            width: 32rpx;
            height: 32rpx;
            flex-shrink: 0;
            color: #fff;
          }

          .header-item-right-ok {
            width: 52rpx;
            height: 52rpx;
            background: #52c41a;
            border-radius: 8rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .header-item-right-no {
            width: 52rpx;
            height: 52rpx;
            background: #f5212d;
            border-radius: 8rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      // 操作栏
      .header-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        color: #9a9a9a;
        line-height: 28rpx;
        column-gap: 12rpx;

        .header-footer-icon {
          width: 30rpx;
          height: 30rpx;
          flex-shrink: 0;
          transform: rotate(-90deg);
        }
      }
    }

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

        .body-item-avatar {
          width: 212rpx;
          height: 212rpx;
          flex-shrink: 0;
          border-radius: 44rpx;
        }

        .body-item-name {
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          line-height: 33rpx;
        }
      }
    }
  }
</style>
