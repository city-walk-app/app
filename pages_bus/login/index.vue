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

  // setTimeout(() => {
  //   step.value += 1
  // }, 2000)

  // /** 登录按钮禁用状态 */
  // const disabled = ref(false)
  // /** 登陆信息 */
  // const loginForm = reactive({ email: '', code: '' })

  // /** 用户身份信息 */
  // const userInfo = ref()
  // /** 按钮倒计时 */
  // const timmer = ref(60)
  // /**获取验证码按钮禁用状态 */
  // const getCodeButtonLoading = ref(false)
  // /** 倒计时定时器 */
  // let timeout

  // /** 验证码长度 */
  // // const codeDigits = 6
  // /** 验证码聚焦索引 */
  // const activeCodeIndex = ref(0)

  // /** 当前需要聚焦的文本框索引 */
  // const inputFouksIndex = ref(0)
  // /** 验证码输入框是否聚焦 */
  // const codeInputFouks = ref(false)

  // // 监听再验证码输入页面返回之后聚焦验证码输入框
  // onShow(() => {
  //   if (step.value === 1) {
  //     codeInputFouks.value = true
  //   }
  // })

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

  // /**
  //  * 发送验证码
  //  */
  // const sendEmail = async () => {
  //   // loading 状态下直接返回
  //   if (getCodeButtonLoading.value) {
  //     return
  //   }

  //   // 邮箱不正确
  //   if (!emailRegex.test(loginForm.email)) {
  //     toast('输入正确邮箱之后再获取')
  //     return
  //   }

  //   showLoading('获取中...')

  //   const res = await API.sendEmail({ email: loginForm.email })

  //   hideLoading()
  //   toast(res.message)

  //   getCodeButtonLoading.value = true

  //   if (res.code === 200) {
  //     startTimmer()
  //     step.value = 1
  //     return
  //   }

  //   clearInterval(timeout)
  //   getCodeButtonLoading.value = false
  //   timmer.value = 60
  // }

  // /**
  //  * 开始按钮倒计时
  //  */
  // const startTimmer = () => {
  //   timeout = setInterval(() => {
  //     if (timmer.value === 0) {
  //       clearInterval(timeout)
  //       getCodeButtonLoading.value = false
  //       timmer.value = 60
  //       return
  //     }

  //     timmer.value--
  //   }, 1000)
  // }

  // /**
  //  * 登录
  //  */
  // const onLogin = async () => {
  //   // 邮箱不正确
  //   if (!emailRegex.test(loginForm.email)) {
  //     toast('邮箱格式不正确')
  //     return
  //   }

  //   // 验证码验证失败
  //   if (!loginForm.code || loginForm.code.length !== 6) {
  //     toast('验证码格式不正确')
  //     return
  //   }

  //   showLoading('处理中...')

  //   disabled.value = true

  //   const res = await API.emailLogin(loginForm)

  //   hideLoading()

  //   disabled.value = false

  //   if (res.code === 200) {
  //     disabled.value = false

  //     userInfo.value = res.data
  //     setStorage(USER_INFO, res.data.user_info)
  //     setStorage(USER_TOKEN, res.data.token)

  //     uni.redirectTo({ url: '/pages/home/index' })
  //     return
  //   }

  //   toast(res.message)
  // }

  // /**
  //  * 监听验证码
  //  */
  // watch(
  //   () => loginForm.code,
  //   (newVal, oldVal) => {
  //     if (newVal.length === 6) {
  //       onLogin()
  //       return
  //     }

  //     if (newVal.length === 0) {
  //       activeCodeIndex.value = 0
  //       return
  //     }

  //     if (newVal.length > oldVal.length) {
  //       activeCodeIndex.value = newVal.length
  //     } else if (newVal.length < oldVal.length) {
  //       activeCodeIndex.value = newVal.length - 1
  //     }
  //   }
  // )

  /**
   * 监听动画结束事件
   */
  const transitionend = () => {
    // inputFouksIndex.value = step.value
    // if (step.value === 1) {
    //   codeInputFouks.value = true
    // }
  }

  // /**
  //  * 验证码文本框失焦
  //  */
  // const onBlur = () => {
  //   codeInputFouks.value = false
  // }
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

        <!-- 输入框 -->
        <div class="email-input-wrapper">
          <input
            v-model="loginForm.email"
            class="email-input"
            type="text"
            placeholder="请输入邮箱"
          />
        </div>

        <!-- 登录按钮 -->
        <div class="button" @click="sendEmail"></div>
      </div>

      <!-- 2. 提交验证码 -->
      <div class="login-swiper-item">2</div>

      <!-- 3. 选择偏好 -->
      <div class="login-swiper-item">3</div>
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
        .email-input-wrapper {
          margin-top: 88rpx;
          width: 646rpx;
          height: 116rpx;
          background: #eeeeee;
          border-radius: 40rpx;
          margin-bottom: 102rpx;

          .email-input {
            width: inherit;
            height: inherit;
            padding: 30rpx 46rpx;
            box-sizing: border-box;
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
      }
    }
  }
</style>
