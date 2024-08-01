<script setup>
  import { ref } from 'vue'
  import { getStorage, setStorage, uploadOSSImages } from '@/utils'
  import { USER_INFO, DEFAULT_AVATAR } from '@/enum'
  import { Api } from '@/api'
  import Sheet from '@/components/sheet'
  import StickyScroll from '@/components/sticky-scroll'

  const API = new Api()

  /** 是否显示对话框 */
  const visibleSheet = ref(false)
  /** 控制弹窗内容的 key */
  const sheetKey = ref('')
  /** 控制弹窗内容的 title */
  const sheetTite = ref('')
  /** 头像文件 */
  const avatarFile = ref()

  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

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

  /**
   * 关闭对话框
   */
  const closeSheet = () => {
    visibleSheet.value = false
  }

  /**
   * 打开对话框
   */
  const openSheet = (key, title) => {
    if (!key) {
      return
    }

    sheetKey.value = key
    sheetTite.value = title
    visibleSheet.value = true
  }

  /**
   * 选择头像
   */
  const chooseAvatar = async () => {
    const res = await uni.chooseImage({
      count: 1, // 选择图片的数量
      sourceType: ['album', 'camera'],
    })

    if (res.errMsg !== 'chooseImage:ok') {
      toast('上传异常，请重试')
      return
    }

    avatarFile.value = res.tempFilePaths[0]

    console.log(avatarFile.value)
  }

  /**
   * 提交信息
   */
  const submitInfo = async () => {
    if (!sheetKey.value) {
      return
    }

    const data = {}

    // 头像设置
    if (sheetKey.value === 'avatar') {
      const upRes = await uploadOSSImages(API, [avatarFile.value])

      if (upRes && upRes.length) {
        data[sheetKey.value] = upRes[0]
      }
    }
    // 其它设置
    else {
      data[sheetKey.value] = userInfoStorage[sheetKey.value]
    }

    // 没有内容
    if (!Object.keys(data).length) {
      visibleSheet.value = false
      return
    }

    const res = await API.setUserInfo(data)

    if (res.code === 200) {
      setStorage(USER_INFO, res.data)
      visibleSheet.value = false
      userInfoStorage.value = res.data
      return
    }

    toast(res.message)
  }

  /**
   * 修改性别
   */
  const changeGender = (value) => {
    if (!value) {
      return
    }

    userInfoStorage.gender = value
  }
</script>

<template>
  <Sheet
    v-model:visible="visibleSheet"
    :title="sheetTite"
    @on-close="closeSheet"
  >
    <!-- 设置页面 -->
    <StickyScroll title="设置">
      <div class="setting">
        <!-- 主要内容 -->
        <div class="main">
          <!-- 头像 -->
          <div class="card">
            <div
              class="card-item-avatar"
              @click="openSheet('avatar', '修改头像')"
            >
              <div class="avatar">
                <div class="avatar-wrapper">
                  <image
                    class="avatar-image"
                    mode="aspectFill"
                    :src="userInfoStorage.avatar || DEFAULT_AVATAR"
                  />
                </div>

                <div class="avatar-title">我的头像</div>
              </div>
            </div>
          </div>

          <!-- 信息 -->
          <div class="card">
            <!-- 名字 -->
            <div class="card-item" @click="openSheet('nick_name', '修改名字')">
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
            <div class="card-item" @click="openSheet('gender', '修改性别')">
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
            <div class="card-item" @click="openSheet('mobile', '修改手机')">
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
            <div class="card-item" @click="openSheet('email', '修改邮箱')">
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
            <div class="card-item" @click="openSheet('signature', '修改签名')">
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
          </div>
        </div>
        <div class="exit-wrapper" @click="outLogin">
          <div class="exit-wrapper-text">退出登录</div>
        </div>
      </div>
    </StickyScroll>

    <!-- 弹窗内容 -->
    <template #content>
      <div class="setting-sheet">
        <!-- 头像 -->
        <template v-if="sheetKey === 'avatar'">
          <div class="setting-sheet-avatar-wrapper" @click="chooseAvatar">
            <image
              v-if="avatarFile"
              class="setting-sheet-avatar-image"
              :src="avatarFile"
              mode="aspectFill"
            />
            <image
              v-else
              class="setting-sheet-avatar-image"
              mode="aspectFill"
              :src="userInfoStorage.avatar || DEFAULT_AVATAR"
            />
          </div>
        </template>

        <!-- 名字 -->
        <template v-else-if="sheetKey === 'nick_name'">
          <div class="setting-sheet-input-wrapper">
            <input
              class="setting-sheet-input"
              type="text"
              v-model="userInfoStorage.nick_name"
            />
          </div>
        </template>

        <!-- 性别 -->
        <template v-else-if="sheetKey === 'gender'">
          <div class="setting-sheet-gender-wrapper">
            <!-- 基本选项 -->
            <div class="setting-sheet-gender-options">
              <div class="setting-sheet-gender-item" @click="changeGender('1')">
                男
              </div>
              <div class="setting-sheet-gender-item" @click="changeGender('2')">
                女
              </div>
            </div>
            <!-- 其它选项 -->
            <div class="setting-sheet-gender-other" @click="changeGender('3')">
              不愿透露
            </div>
          </div>
        </template>

        <!-- 手机 -->
        <template v-else-if="sheetKey === 'mobile'">
          <div class="setting-sheet-input-wrapper">
            <input
              class="setting-sheet-input"
              type="text"
              v-model="userInfoStorage.mobile"
            />
          </div>
        </template>

        <!-- 邮箱 -->
        <template v-else-if="sheetKey === 'email'">
          <div class="setting-sheet-input-wrapper">
            <input
              class="setting-sheet-input"
              type="text"
              v-model="userInfoStorage.email"
            />
          </div>
        </template>

        <!-- 签名 -->
        <template v-else-if="sheetKey === 'signature'">
          <div class="setting-sheet-input-wrapper">
            <input
              class="setting-sheet-input"
              type="text"
              v-model="userInfoStorage.signature"
            />
          </div>
        </template>

        <!-- 提交按钮 -->
        <div class="setting-sheet-submit-button" @click="submitInfo">
          就这样
        </div>
      </div>
    </template>
  </Sheet>
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

  // 对话框
  .setting-sheet {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 32rpx 32rpx 32rpx;
    box-sizing: border-box;

    // 头像容器
    .setting-sheet-avatar-wrapper {
      width: 366rpx;
      height: 366rpx;
      border-radius: 50%;

      .setting-sheet-avatar-image {
        width: inherit;
        height: inherit;
        border-radius: inherit;
      }
    }

    // 输入框
    .setting-sheet-input-wrapper {
      width: 646rpx;
      height: 116rpx;
      background: #eee;
      border-radius: 40rpx;

      .setting-sheet-input {
        width: inherit;
        height: inherit;
        padding: 30rpx 46rpx;
        box-sizing: border-box;
        font-size: 34rpx;
        font-weight: 600;
        color: #333;
      }
    }

    // 性别
    .setting-sheet-gender-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 32rpx;

      // 选项
      .setting-sheet-gender-options {
        display: flex;
        align-items: center;
        column-gap: 24rpx;

        .setting-sheet-gender-item {
          width: 300rpx;
          height: 300rpx;
          background: #eee;
          border-radius: 40rpx;
          padding: 28rpx;
          box-sizing: border-box;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
      }

      // 不愿透露的
      .setting-sheet-gender-other {
        width: 624rpx;
        height: 116rpx;
        background: #eee;
        border-radius: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    // 提交按钮
    .setting-sheet-submit-button {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 96rpx;
      background: #f3943f;
      border-radius: 28rpx;
      border: 3rpx solid #f3943f;
      font-weight: 400;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 38rpx;
    }
  }
</style>
