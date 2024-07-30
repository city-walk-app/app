<script setup>
  import { reactive, ref, watch } from 'vue'
  import { Api } from '@/api'
  import { onShow } from '@dcloudio/uni-app'
  import { toast, showLoading, hideLoading, setStorage } from '@/utils'
  import { USER_INFO, USER_TOKEN } from '@/enum'

  const API = new Api()

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  /** 步骤 */
  const step = ref(0)
  /** 验证码长度 */
  const codeLength = ref(6)
  /** 登陆信息 */
  const loginForm = reactive({ email: '', code: '' })
  /** 偏好列表 */
  const preferences = ref([
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
    { key: '', title: '', active: '' },
  ])

  /**
   * 发送验证码
   */
  const sendEmail = async () => {
    // 邮箱不正确
    if (!emailRegex.test(loginForm.email)) {
      toast('输入正确邮箱之后再获取')
      return
    }

    showLoading('获取中...')

    const res = await API.sendEmail({ email: loginForm.email })

    hideLoading()

    if (res.code === 200) {
      toast('获取成功')
      step.value = 1
    }
  }

  /**
   * 登录
   */
  const onLogin = async () => {
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
        uni.redirectTo({ url: '/pages/home/index' })
      }

      return
    }

    toast(res.message)
  }

  /**
   * 提交偏好设置
   */
  const submit = async () => {}

  /**
   * 监听动画结束事件
   */
  const transitionend = () => {}

  watch(
    () => loginForm.code,
    (newValue) => {
      console.log(newValue)
      if (newValue.length === codeLength.value) {
        onLogin() // 登录
      }
    }
  )
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
              @confirm="sendEmail"
            />
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="button" @click="sendEmail"></div>
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
          <div class="code-input-wrapper">
            <div class="code-input-item" v-for="i in codeLength" :key="i">
              {{ loginForm.code[i - 1] || '' }}
            </div>
            <input
              v-model="loginForm.code"
              class="code-input"
              type="number"
              @conform="onLogin"
            />
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="button" @click="onLogin"></div>

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
              class="preference-item"
              v-for="(item, index) in preferences"
              :key="index"
            ></div>
          </div>
        </div>

        <!-- 登录按钮 -->
        <div class="button" @click="submit"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .login {
    overflow: hidden;
    height: 100vh;
    width: 100vw;

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

            .email-input {
              width: inherit;
              height: inherit;
              padding: 30rpx 46rpx;
              box-sizing: border-box;
              font-size: 34rpx;
              font-weight: 600;
              color: #333;
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
            }

            .code-input {
              position: absolute;
              inset: 0;
              height: 100%;
              background-color: transparent;
              color: transparent;
              border: transparent;
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
              background: #eee;
              border-radius: 16rpx;
            }
          }
        }

        .button {
          width: 180rpx;
          height: 180rpx;
          background: #f3943f;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
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
