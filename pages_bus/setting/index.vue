<script setup>
  import { ref } from 'vue'
  import { getStorage } from '@/utils'
  import { USER_INFO } from '@/enum'
  import { Api } from '@/api'
  import Sheet from '@/components/sheet'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()

  /** 用户信息 */
  const userInfo = ref()

  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (userInfo.value && userInfo.value.user_id) {
      return
    }

    const res = await API.getUserInfo({
      user_id: userInfoStorage.value.user_id,
    })

    if (res.code === 200) {
      userInfo.value = res.data
    }
  }

  // getUserInfo()

  /**
   * 点击退出登录
   */
  const outLogin = async () => {
    const res = await uni.showModal({
      title: '退出登录',
      content: '确定退出登录吗？',
      showCancel: true,
    })

    if (res.errMsg !== 'showModal:ok') {
      toast('弹窗异常')
      return
    }

    if (res.confirm) {
      uni.clearStorage()
      uni.redirectTo({ url: '/pages/home/index' })
    }
  }
</script>

<template>
  <StickyScroll title="设置">
    <div class="setting">
      <!-- 主要内容 -->
      <div class="main">
        <!-- 头像 -->
        <div class="card">
          <div class="card-item-avatar">
            <div class="avatar">
              <div class="avatar-wrapper">
                <image
                  class="avatar-image"
                  src="https://img1.baidu.com/it/u=1784112474,311889214&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
                  mode="aspectFill"
                />
              </div>

              <div class="avatar-title">我的头像</div>
            </div>
          </div>
        </div>

        <!-- 信息 -->
        <div class="card">
          <!-- 名字 -->
          <div class="card-item">
            <div class="card-item-label">
              <image
                class="card-item-label-icon"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-nick-name.png"
              />
              <div class="card-item-label-title">名字</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 性别 -->
          <div class="card-item">
            <div class="card-item-label">
              <image
                class="card-item-label-icon"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-nick-name.png"
              />
              <div class="card-item-label-title">性别</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 手机 -->
          <div class="card-item">
            <div class="card-item-label">
              <image
                class="card-item-label-icon"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-nick-name.png"
              />
              <div class="card-item-label-title">手机</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 邮箱 -->
          <div class="card-item">
            <div class="card-item-label">
              <image
                class="card-item-label-icon"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-nick-name.png"
              />
              <div class="card-item-label-title">邮箱</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 签名 -->
          <div class="card-item">
            <div class="card-item-label">
              <image
                class="card-item-label-icon"
                src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-nick-name.png"
              />
              <div class="card-item-label-title">签名</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>
        </div>

        <!-- 账户 -->
        <div class="card">
          <!-- 赞助 -->
          <div class="card-item">
            <div class="card-item-label">
              <div class="card-item-label-sutitle">赞助</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 加入 CityWalk -->
          <div class="card-item">
            <div class="card-item-label">
              <div class="card-item-label-sutitle">加入 CityWalk</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 给个好评 -->
          <div class="card-item">
            <div class="card-item-label">
              <div class="card-item-label-sutitle">给个好评</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- Github -->
          <div class="card-item">
            <div class="card-item-label">
              <div class="card-item-label-sutitle">Github</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>

          <!-- 签名 -->
          <div class="card-item">
            <div class="card-item-label">
              <div class="card-item-label-title">签名</div>
            </div>

            <image class="card-item-arrow" src="" />
          </div>
        </div>
      </div>
      <div class="exit-wrapper" @click="outLogin">
        <div class="exit-wrapper-text">退出登录</div>
      </div>
    </div>
  </StickyScroll>
</template>

<style lang="scss">
  .setting {
    padding: 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    row-gap: 40rpx;

    .main {
      display: flex;
      flex-direction: column;
      row-gap: 32rpx;

      // 卡片
      .card {
        width: 100%;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
        border-radius: 32rpx 32rpx 32rpx 32rpx;
        border: 2rpx solid;
        border-image: linear-gradient(
            162deg,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          )
          2 2;

        // 头像
        .card-item-avatar {
          padding: 26rpx 32rpx;
          box-sizing: border-box;

          // 头像
          .avatar {
            display: flex;
            align-items: center;
            column-gap: 36rpx;

            .avatar-wrapper {
              width: 120rpx;
              height: 120rpx;
              border-radius: 50%;

              .avatar-image {
                width: inherit;
                height: inherit;
                border-radius: inherit;
              }
            }
          }
        }

        // 每一项
        .card-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 120rpx;
          padding: 34rpx 32rpx;
          box-sizing: border-box;

          .card-item-label {
            display: flex;
            align-items: center;
            column-gap: 28rpx;

            .card-item-label-icon {
              width: 52rpx;
              height: 52rpx;
              border-radius: 50%;
            }

            // 标题
            .card-item-label-title {
              font-weight: 400;
              font-size: 28rpx;
              color: #333333;
              line-height: 33rpx;
            }

            // 副标题
            .card-item-label-sutitle {
              font-weight: 400;
              font-size: 28rpx;
              color: #666666;
              line-height: 33rpx;
            }
          }

          .card-item-arrow {
            width: 20rpx;
            height: 20rpx;
            flex-shrink: 0;
          }
        }
      }
    }

    // 退出
    .exit-wrapper {
      width: 100%;
      height: 120rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
      border-radius: 32rpx 32rpx 32rpx 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .exit-wrapper-text {
        font-weight: 400;
        font-size: 32rpx;
        color: #f65e56;
        line-height: 38rpx;
      }
    }
  }
</style>
