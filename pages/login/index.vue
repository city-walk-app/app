<script setup>
  import { reactive, ref, watch } from 'vue'
  import { Api } from '@/api'
  import { onShow, onLoad } from '@dcloudio/uni-app'
  import { toast, showLoading, hideLoading, setStorage } from '@/utils'
  import { USER_INFO, USER_TOKEN, preferences } from '@/enum'

  const API = new Api()

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  /** 步骤 */
  const step = ref(0)
  /** 验证码长度 */
  const codeLength = ref(6)
  /** 登陆信息 */
  const loginForm = reactive({ email: '', code: '' })
  /** 邮箱输入框聚焦 */
  const emailInputFocus = ref(false)
  /** 验证码输入框聚焦 */
  const codeInputFocus = ref(false)
  /** 偏好列表 */
  const preferenceList = ref(preferences)
  /** 邀请 id */
  const inviteId = ref()

  /**
   * 发送验证码
   */
  const sendEmail = async () => {
    try {
      // 邮箱不正确
      if (!emailRegex.test(loginForm.email)) {
        toast('输入正确邮箱之后再获取')
        return
      }

      showLoading('获取中...')

      const res = await API.sendEmail({ email: loginForm.email })

      console.log(res)

      hideLoading()

      if (res.code === 200) {
        toast('获取成功')
        step.value = 1
      }
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 返回首页
   */
  const redirectHome = () => {
    if (inviteId.value) {
      uni.redirectTo({
        url: `/pages/home/index?invite_id=${inviteId.value}`,
      })
    } else {
      uni.redirectTo({ url: '/pages/home/index' })
    }
  }

  /**
   * 登录
   */
  const onLogin = async () => {
    try {
      // 验证码验证失败
      if (!loginForm.code || loginForm.code.length !== 6) {
        toast('验证码格式不正确')
        return
      }

      showLoading('处理中...')

      const res = await API.emailLogin(loginForm)

      hideLoading()

      if (res.code === 200) {
        setStorage(USER_INFO, res.data.user_info)
        setStorage(USER_TOKEN, res.data.token)

        // 新用户完善偏好设置
        if (res.data.is_new_user) {
          step.value = 2
        } else {
          redirectHome() // 返回首页
        }

        return
      }

      toast(res.message)
    } catch (err) {
      console.log('接口异常', err)
    }
  }

  /**
   * 提交偏好设置
   */
  const submit = async () => {
    try {
      const activePreference = preferenceList.value.filter(
        (item) => item.active
      )

      if (!activePreference || !activePreference.length) {
        toast('请选择至少一个偏好')
        return
      }

      showLoading('处理中...')

      const res = await API.setUserInfo({
        preference_type: activePreference.map((item) => item.key),
      })

      hideLoading()

      if (res.code === 200) {
        redirectHome() // 返回首页
      }
    } catch (err) {
      console.log('设置信息接口异常', err)
    }
  }

  /**
   * 获取焦点
   */
  const autoFocus = () => {
    if (step.value === 0) {
      emailInputFocus.value = true
    } else if (step.value === 1) {
      codeInputFocus.value = true
    }
  }

  /**
   * 监听动画结束事件
   */
  const transitionend = () => {
    autoFocus() // 获取焦点
  }

  watch(
    () => loginForm.code,
    (newValue) => {
      if (newValue.length === codeLength.value) {
        onLogin() // 登录
      }
    }
  )

  /**
   * 选择偏好
   */
  const selectPreference = (item) => {
    item.active = !item.active
  }

  onShow(() => {
    autoFocus() // 获取焦点
  })

  onLoad((options) => {
    console.log('login 启动参数', options)
    if (options.invite_id) {
      inviteId.value = options.invite_id
    }
  })
</script>

<template>
  <div class="login">
    <div
      class="login-swiper"
      :style="{ transform: `translateX(-${step * 100}vw)` }"
      @transitionend.self="transitionend"
    >
      <!-- 1. 输入邮箱 -->
      <div class="login-swiper-item">
        <!-- 头部 -->
        <div class="header">
          <div class="header-logo-wrapper">
            <image
              class="header-logo"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/logo.jpg"
            />
          </div>

          <div class="header-title">欢迎，请登录</div>
        </div>

        <div class="body">
          <!-- 输入框 -->
          <div class="email-input-wrapper">
            <input
              v-model="loginForm.email"
              class="email-input"
              type="text"
              placeholder="请输入邮箱"
              placeholder-class="email-input-placeholder"
              :adjust-position="false"
              :focus="emailInputFocus"
              @confirm="sendEmail"
            />
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="button" hover-class="button-hover" @click="sendEmail">
          <image class="button-icon" src="/assets/svg/right.svg" />
        </div>
      </div>

      <!-- 2. 提交验证码 -->
      <div class="login-swiper-item">
        <!-- 头部 -->
        <div class="header">
          <div class="header-logo-wrapper">
            <image
              class="header-logo"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/logo.jpg"
            />
          </div>

          <div class="header-title">请输入验证码</div>
        </div>

        <div class="body">
          <!-- 验证码 -->
          <div class="code-input-wrapper" @click="codeInputFocus = true">
            <!-- 验证码输入框 -->
            <div
              :class="[
                'code-input-item',
                { 'code-input-item-active': i - 1 === loginForm.code.length },
              ]"
              v-for="i in codeLength"
              :key="i"
            >
              {{ loginForm.code[i - 1] || '' }}
            </div>

            <!-- 隐藏的输入框 -->
            <input
              v-model="loginForm.code"
              class="code-input"
              type="number"
              :focus="codeInputFocus"
              :adjust-position="false"
              @blur="codeInputFocus = false"
              @conform="onLogin"
            />
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="button" hover-class="button-hover" @click="onLogin">
          <image class="button-icon" src="/assets/svg/right.svg" />
        </div>

        <!-- 重新获取 -->
        <div class="try-send">重新获取</div>
      </div>

      <!-- 3. 选择偏好 -->
      <div class="login-swiper-item">
        <!-- 头部 -->
        <div class="header">
          <div class="header-logo-wrapper">
            <image
              class="header-logo"
              src="https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/logo.jpg"
            />
          </div>

          <div class="header-title">你的偏好？</div>
        </div>

        <!-- 输入框 -->
        <div class="body">
          <div class="preferences">
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
        </div>

        <!-- 登录按钮 -->
        <div class="button" hover-class="button-hover" @click="submit">
          <image class="button-icon" src="/assets/svg/right.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .login {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background: url('https://city-walk.oss-cn-beijing.aliyuncs.com/assets/images/city-walk/main-blank.png')
      no-repeat;

    // 登录表单轮播图
    .login-swiper {
      padding-top: 316rpx;
      box-sizing: border-box;
      height: inherit;
      width: 300vw;
      display: flex;
      flex-wrap: nowrap;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      // 每一项轮播内容
      .login-swiper-item {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 35px;
        box-sizing: border-box;
        flex-shrink: 0;
        position: relative;

        // 头部
        .header {
          display: flex;
          align-items: flex-end;
          column-gap: 40rpx;
          width: 100%;
          justify-content: flex-start;

          // logo
          .header-logo-wrapper {
            width: 112rpx;
            height: 112rpx;
            border-radius: 50%;

            .header-logo {
              width: inherit;
              height: inherit;
              border-radius: 50%;
            }
          }

          // 标题
          .header-title {
            font-weight: 400;
            font-size: 56rpx;
            color: #333333;
            line-height: 66rpx;
          }
        }

        // 邮箱输入框
        .body {
          margin-bottom: 102rpx;
          margin-top: 88rpx;

          // 邮箱输入框
          .email-input-wrapper {
            width: 646rpx;
            height: 116rpx;
            background: #eee;
            border-radius: 40rpx;
            border: 3rpx solid transparent;
            transition: 0.24s;

            &:focus-within {
              border-color: var(--cw-theme-1);
              background-color: #fff;
            }

            .email-input {
              width: inherit;
              height: inherit;
              padding: 30rpx 46rpx;
              box-sizing: border-box;
              font-size: 34rpx;
              font-weight: 600;
              color: #333;
            }

            .email-input-placeholder {
              font-weight: 400;
              color: #a8a8a8;
            }
          }

          // 验证码输入框
          .code-input-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            column-gap: 16rpx;
            position: relative;

            .code-input-item {
              width: 99rpx;
              height: 116rpx;
              background: #eee;
              border-radius: 31rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-shrink: 0;
              font-size: 34rpx;
              font-weight: 600;
              color: #333;
              border: 3rpx solid transparent;

              &.code-input-item-active {
                border-color: var(--cw-theme-1);
                background-color: #fff;
              }
            }

            .code-input {
              position: fixed;
              left: -99999rpx;
            }
          }

          // 偏好设置
          .preferences {
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
        }

        .button {
          width: 180rpx;
          height: 180rpx;
          background: var(--cw-theme-1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.23s;

          .button-icon {
            width: 99rpx;
            height: 99rpx;
            flex-shrink: 0;
          }
        }

        // 按钮点击效果
        .button-hover {
          background-color: #f8d035;
        }

        // 重新获取
        .try-send {
          font-weight: 400;
          font-size: 32rpx;
          color: #f8d035;
          line-height: 38rpx;
          margin-top: 114rpx;
        }
      }
    }
  }
</style>
