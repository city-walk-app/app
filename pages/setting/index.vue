<script setup>
  import { ref } from 'vue'
  import {
    getStorage,
    setStorage,
    uploadOSSImages,
    showLoading,
    hideLoading,
    isArray,
  } from '@/utils'
  import { USER_INFO, DEFAULT_AVATAR, preferences } from '@/enum'
  import { Api } from '@/api'
  import Sheet from '@/components/sheet'
  import StickyScroll from '@/components/sticky-scroll'
  import { toast } from '../../utils'
  import CwButton from '@/components/cw-button'

  const API = new Api()

  /** 是否显示对话框 */
  const visibleSheet = ref(false)
  /** 控制弹窗内容的 key */
  const sheetKey = ref('')
  /** 控制弹窗内容的 title */
  const sheetTitle = ref('')
  /** 头像文件 */
  const avatarFile = ref()
  /** 偏好列表 */
  const preferenceList = ref()

  /** 缓存的当前用户信息 */
  const userInfoStorage = ref(getStorage(USER_INFO))

  /**
   * 设置偏好设置
   */
  const setPreferenceList = () => {
    try {
      const preferenceType = userInfoStorage.value.preference_type

      if (isArray(preferenceType) && preferenceType.length) {
        preferenceList.value = preferences.map((item) => {
          return {
            ...item,
            active: preferenceType.includes(item.key),
          }
        })
        return
      }

      preferenceList.value = preferences
    } catch (err) {
      console.log('设置偏好设置异常', err)
      preferenceList.value = preferences
    }
  }

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
   * 关闭结束执行的回调
   */
  const closeSheetEnd = () => {
    console.log('关闭结束')
    avatarFile.value = null
    sheetKey.value = ''
    sheetTitle.value = ''
  }

  /**
   * 打开对话框
   */
  const openSheet = (key, title) => {
    if (!key) {
      return
    }

    sheetKey.value = key
    sheetTitle.value = title
    visibleSheet.value = true
  }

  /**
   * 选择头像
   */
  const chooseAvatar = async () => {
    try {
      const res = await uni.chooseImage({
        count: 1, // 选择图片的数量
        sourceType: ['album', 'camera'],
      })

      // 上传成功
      if (res.errMsg === 'chooseImage:ok') {
        avatarFile.value = res.tempFilePaths[0]
      }
    } catch (err) {
      console.log('上传头像异常', err)
    }
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
      try {
        // 没有选择图片
        if (!avatarFile.value || !avatarFile.value.length) {
          closeSheet() // 关闭对话框
          return
        }

        const upRes = await uploadOSSImages(API, [avatarFile.value])

        if (upRes && upRes.length) {
          data[sheetKey.value] = upRes[0]
        }
      } catch (err) {
        console.log('头像设置异常', err)

        toast('头像处理异常')
        closeSheet() // 关闭对话框
        return
      }
    }
    // 偏好设置
    else if (sheetKey.value === 'preference_type') {
      const activePreference = preferenceList.value.filter(
        (item) => item.active
      )

      if (activePreference && activePreference.length) {
        data[sheetKey.value] = activePreference.map((item) => item.key)
      }
    }
    // 其它设置
    else {
      data[sheetKey.value] = userInfoStorage.value[sheetKey.value]
    }

    // 没有内容
    if (!Object.keys(data).length) {
      closeSheet() // 关闭对话框
      return
    }

    try {
      showLoading('处理中...')

      const res = await API.setUserInfo(data)

      hideLoading()

      if (res.code === 200) {
        setStorage(USER_INFO, res.data)
        closeSheet() // 关闭对话框
        userInfoStorage.value = res.data
        return
      }

      toast(res.message)
    } catch (err) {
      console.log('接口异常', err)
    }
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

  /**
   * 选择偏好
   */
  const selectPreference = (item) => {
    item.active = !item.active
  }

  /**
   * 复制 github 链接
   */
  const copyGithubLink = async () => {
    try {
      const res = await uni.setClipboardData({
        data: 'https://github.com/city-walk-app',
      })

      if (res.errMsg === 'setClipboardData:ok') {
        toast('复制成功，可粘贴到浏览器访问')
        return
      }

      toast('复制异常，请重试')
    } catch (err) {
      console.log('复制异常', err)

      toast('复制异常，请重试')
    }
  }

  setPreferenceList() // 设置偏好设置
</script>

<template>
  <Sheet
    v-model:visible="visibleSheet"
    is-move-close
    :title="sheetTitle"
    @on-close="closeSheet"
    @on-close-end="closeSheetEnd"
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
              hover-class="card-item-hover"
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
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('nick_name', '修改名字')"
            >
              <div class="card-item-label">
                <div
                  class="card-item-label-icon-wrapper"
                  style="--background: #ef442f"
                >
                  <image
                    class="card-item-label-icon"
                    src="/assets/svg/setting-nick-name.svg"
                  />
                </div>
                <div class="card-item-label-title">名字</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 性别 -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('gender', '修改性别')"
            >
              <div class="card-item-label">
                <div
                  class="card-item-label-icon-wrapper"
                  style="--background: #f39026"
                >
                  <image
                    class="card-item-label-icon"
                    src="/assets/svg/setting-gender.svg"
                  />
                </div>
                <div class="card-item-label-title">性别</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 手机 -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('mobile', '修改手机')"
            >
              <div class="card-item-label">
                <div
                  class="card-item-label-icon-wrapper"
                  style="--background: #fac736"
                >
                  <image
                    class="card-item-label-icon"
                    src="/assets/svg/setting-mobile.svg"
                  />
                </div>
                <div class="card-item-label-title">手机</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 偏好 -->
            <div
              class="card-item"
              @click="openSheet('preference_type', '修改偏好')"
            >
              <div class="card-item-label">
                <div
                  class="card-item-label-icon-wrapper"
                  style="--background: #50c348"
                >
                  <image
                    class="card-item-label-icon"
                    src="/assets/svg/setting-preference-type.svg"
                  />
                </div>
                <div class="card-item-label-title">偏好</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 签名 -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('signature', '修改签名')"
            >
              <div class="card-item-label">
                <div
                  class="card-item-label-icon-wrapper"
                  style="--background: #1d6ff8"
                >
                  <image
                    class="card-item-label-icon"
                    src="/assets/svg/setting-signature.svg"
                  />
                </div>
                <div class="card-item-label-title">签名</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>
          </div>

          <!-- 账户 -->
          <div class="card">
            <!-- 赞助 -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('sponsor', '赞助')"
            >
              <div class="card-item-label">
                <div class="card-item-label-sutitle">赞助</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 加入 CityWalk -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="openSheet('join', '加入 CityWalk')"
            >
              <div class="card-item-label">
                <div class="card-item-label-sutitle">加入 CityWalk</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- Github -->
            <div
              class="card-item"
              hover-class="card-item-hover"
              @click="copyGithubLink"
            >
              <div class="card-item-label">
                <div class="card-item-label-sutitle">Github</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </div>

            <!-- 联系客服 -->
            <button
              class="card-item"
              open-type="contact"
              hover-class="card-item-hover"
            >
              <div class="card-item-label">
                <div class="card-item-label-sutitle">联系客服</div>
              </div>

              <image
                class="card-item-arrow"
                src="/assets/svg/right-black.svg"
              />
            </button>
          </div>
        </div>

        <!-- 退出登录 -->
        <div
          class="exit-wrapper"
          hover-class="exit-wrapper-hover"
          @click="outLogin"
        >
          <div class="exit-wrapper-text">退出登录</div>
        </div>
      </div>
    </StickyScroll>

    <!-- 弹窗内容 -->
    <template #content>
      <div class="setting-sheet">
        <div class="setting-sheet-body">
          <!-- 头像 -->
          <template v-if="sheetKey === 'avatar'">
            <div class="setting-sheet-avatar-wrapper" @click="chooseAvatar">
              <image
                v-if="avatarFile"
                class="setting-sheet-avatar-image"
                mode="aspectFill"
                :src="avatarFile"
              />
              <image
                v-else
                class="setting-sheet-avatar-image"
                mode="aspectFill"
                :src="userInfoStorage.avatar || DEFAULT_AVATAR"
              />

              <div v-if="!avatarFile" class="setting-sheet-avatar-title">
                点击选择照片
              </div>
            </div>
          </template>

          <!-- 名字 -->
          <template v-else-if="sheetKey === 'nick_name'">
            <div class="setting-sheet-input-wrapper">
              <input
                v-model="userInfoStorage.nick_name"
                class="setting-sheet-input"
                type="text"
                :maxlength="16"
                :adjust-position="false"
              />
            </div>
          </template>

          <!-- 性别 -->
          <template v-else-if="sheetKey === 'gender'">
            <div class="setting-sheet-gender-wrapper">
              <!-- 基本选项 -->
              <div class="setting-sheet-gender-options">
                <div
                  class="setting-sheet-gender-item"
                  @click="changeGender('1')"
                >
                  男
                </div>
                <div
                  class="setting-sheet-gender-item"
                  @click="changeGender('2')"
                >
                  女
                </div>
              </div>
              <!-- 其它选项 -->
              <div
                class="setting-sheet-gender-other"
                @click="changeGender('3')"
              >
                不愿透露
              </div>
            </div>
          </template>

          <!-- 手机 -->
          <template v-else-if="sheetKey === 'mobile'">
            <div class="setting-sheet-input-wrapper">
              <input
                v-model="userInfoStorage.mobile"
                class="setting-sheet-input"
                type="number"
                :maxlength="11"
                :adjust-position="false"
              />
            </div>
          </template>

          <!-- 偏好 -->
          <template v-else-if="sheetKey === 'preference_type'">
            <div class="setting-sheet-preference-wrapper">
              <div
                :class="[
                  'preference-item',
                  {
                    'preference-item-active': item.active,
                  },
                ]"
                v-for="(item, index) in preferenceList"
                :key="index"
                @click="selectPreference(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </template>

          <!-- 签名 -->
          <template v-else-if="sheetKey === 'signature'">
            <div class="setting-sheet-input-wrapper">
              <input
                v-model="userInfoStorage.signature"
                class="setting-sheet-input"
                type="text"
                :maxlength="30"
                :adjust-position="false"
              />
            </div>
          </template>

          <!-- 赞助 -->
          <template v-else-if="sheetKey === 'sponsor'">
            <div class="setting-sheet-other-wrapper">
              <div class="cw-skeleton-animated setting-sheet-qrcode-box">
                <image
                  class="setting-sheet-qrcode"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-qrcode-sponsor.jpg"
                  mode="aspectFill"
                  show-menu-by-longpress
                />
              </div>
            </div>
          </template>

          <!-- 加入 CityWalk -->
          <template v-else-if="sheetKey === 'join'">
            <div class="setting-sheet-other-wrapper">
              <div class="cw-skeleton-animated setting-sheet-qrcode-box">
                <image
                  class="setting-sheet-qrcode"
                  src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/setting-qrcode-join.jpg"
                  mode="aspectFill"
                  show-menu-by-longpress
                />
              </div>
            </div>
          </template>
        </div>

        <!-- 提交按钮 -->
        <CwButton
          v-if="sheetKey === 'sponsor' || sheetKey === 'join'"
          type="line"
          block
          @click="closeSheet"
        >
          好的
        </CwButton>
        <CwButton v-else block @click="submitInfo">就这样</CwButton>
      </div>
    </template>
  </Sheet>
</template>

<style lang="scss">
  // 设置页面
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
        overflow: hidden;

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
              background-color: var(--cw-skeleton-background-light);

              .avatar-image {
                width: inherit;
                height: inherit;
                border-radius: inherit;
                flex-shrink: 0;
              }

              // 标题
              .avatar-title {
                font-weight: 400;
                font-size: 36rpx;
                color: #333333;
                line-height: 42rpx;
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
          transition: background 0.11s;
          background-color: transparent;
          border-radius: 0;
          border: none;

          &::after {
            display: none;
          }

          // 标签
          .card-item-label {
            display: flex;
            align-items: center;
            column-gap: 28rpx;

            .card-item-label-icon-wrapper {
              width: 52rpx;
              height: 52rpx;
              border-radius: 50%;
              flex-shrink: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: var(--background);

              .card-item-label-icon {
                width: 32rpx;
                height: 32rpx;
                flex-shrink: 0;
              }
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

          // 右箭头
          .card-item-arrow {
            width: 30rpx;
            height: 30rpx;
            flex-shrink: 0;
          }
        }

        // 点击状态
        .card-item-hover {
          background: rgba(0, 0, 0, 0.06);
        }
      }
    }

    // 退出
    .exit-wrapper {
      width: 100%;
      height: 120rpx;
      background: #ffffff;
      box-shadow: 0rpx 0rpx 17rpx 0rpx rgba(159, 159, 159, 0.25);
      border-radius: 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transition: background 0.11s;

      .exit-wrapper-text {
        font-weight: 400;
        font-size: 32rpx;
        color: #f65e56;
        line-height: 38rpx;
      }
    }

    // 点击状态
    .exit-wrapper-hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }

  // 对话框
  .setting-sheet {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    padding: 60rpx 32rpx var(--cw-padding-bottom) 32rpx;
    box-sizing: border-box;

    .setting-sheet-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      // 头像容器
      .setting-sheet-avatar-wrapper {
        width: 366rpx;
        height: 366rpx;
        border-radius: 50%;
        background-color: var(--cw-skeleton-background-light);
        display: flex;
        align-items: center;
        flex-direction: column;
        row-gap: 26rpx;

        // 预览的头像
        .setting-sheet-avatar-image {
          width: inherit;
          height: inherit;
          border-radius: inherit;
          flex-shrink: 0;
        }

        // 标题
        .setting-sheet-avatar-title {
          font-weight: 400;
          font-size: 28rpx;
          color: #9a9a9a;
          line-height: 33rpx;
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

      // 其它的
      .setting-sheet-other-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        row-gap: 20rpx;

        .setting-sheet-qrcode-box {
          width: 500rpx;
          height: 700rpx;
          flex-shrink: 0;
          border-radius: 20rpx;
          overflow: hidden;
          background-color: var(--cw-skeleton-background-light);

          .setting-sheet-qrcode {
            width: inherit;
            height: inherit;
            flex-shrink: 0;
          }
        }
      }

      // 偏好设置
      .setting-sheet-preference-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 48rpx;
        row-gap: 50rpx;

        .preference-item {
          width: 192rpx;
          height: 184rpx;
          flex-shrink: 0;
          background: #eee;
          border-radius: 16rpx;
          padding: 20rpx 21rpx;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          color: #333;
          font-size: 27rpx;
          font-weight: 600;

          &.preference-item-active {
            background-color: var(--cw-theme-1);
            color: #fff;
          }
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
    }
  }
</style>
