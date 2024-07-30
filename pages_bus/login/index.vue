<script setup>
  import { reactive, ref, watch } from 'vue'
  import { Api } from '@/api'
  import { onShow } from '@dcloudio/uni-app'
  import { toast, showLoading, hideLoading, setStorage } from '@/utils'
  import { USER_INFO, USER_TOKEN } from '@/enum'

  const API = new Api()

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  /** 登录按钮禁用状态 */
  const disabled = ref(false)
  /** 登陆信息 */
  const loginInfo = reactive({ email: '', code: '' })
  /** 步骤 */
  const step = ref(0)
  /** 用户身份信息 */
  const userInfo = ref()
  /** 按钮倒计时 */
  const timmer = ref(60)
  /**获取验证码按钮禁用状态 */
  const getCodeButtonLoading = ref(false)
  /** 倒计时定时器 */
  let timeout

  /** 验证码长度 */
  // const codeDigits = 6
  /** 验证码聚焦索引 */
  const activeCodeIndex = ref(0)

  /** 当前需要聚焦的文本框索引 */
  const inputFouksIndex = ref(0)
  /** 验证码输入框是否聚焦 */
  const codeInputFouks = ref(false)

  // 监听再验证码输入页面返回之后聚焦验证码输入框
  onShow(() => {
    if (step.value === 1) {
      codeInputFouks.value = true
    }
  })

  /**
   * 发送验证码
   */
  const sendEmail = async () => {
    // loading 状态下直接返回
    if (getCodeButtonLoading.value) {
      return
    }

    // 邮箱不正确
    if (!emailRegex.test(loginInfo.email)) {
      toast('输入正确邮箱之后再获取')
      return
    }

    showLoading('获取中...')

    const res = await API.sendEmail({ email: loginInfo.email })

    hideLoading()
    toast(res.message)

    getCodeButtonLoading.value = true

    if (res.code === 200) {
      startTimmer()
      step.value = 1
      return
    }

    clearInterval(timeout)
    getCodeButtonLoading.value = false
    timmer.value = 60
  }

  /**
   * 开始按钮倒计时
   */
  const startTimmer = () => {
    timeout = setInterval(() => {
      if (timmer.value === 0) {
        clearInterval(timeout)
        getCodeButtonLoading.value = false
        timmer.value = 60
        return
      }

      timmer.value--
    }, 1000)
  }

  /**
   * 登录
   */
  const onLogin = async () => {
    // 邮箱不正确
    if (!emailRegex.test(loginInfo.email)) {
      toast('邮箱格式不正确')
      return
    }

    // 验证码验证失败
    if (!loginInfo.code || loginInfo.code.length !== 6) {
      toast('验证码格式不正确')
      return
    }

    showLoading('处理中...')

    disabled.value = true

    const res = await API.emailLogin(loginInfo)

    hideLoading()

    disabled.value = false

    if (res.code === 200) {
      disabled.value = false

      userInfo.value = res.data
      setStorage(USER_INFO, res.data.user_info)
      setStorage(USER_TOKEN, res.data.token)

      uni.redirectTo({ url: '/pages/home/index' })
      return
    }

    toast(res.message)
  }

  /**
   * 监听验证码
   */
  watch(
    () => loginInfo.code,
    (newVal, oldVal) => {
      if (newVal.length === 6) {
        onLogin()
        return
      }

      if (newVal.length === 0) {
        activeCodeIndex.value = 0
        return
      }

      if (newVal.length > oldVal.length) {
        activeCodeIndex.value = newVal.length
      } else if (newVal.length < oldVal.length) {
        activeCodeIndex.value = newVal.length - 1
      }
    }
  )

  const wxLogin = async () => {
    const res = await uni.login()

    console.log(res)
  }

  wxLogin()

  /**
   * 手机号登录
   */
  const getphonenumber = async (evt) => {
    console.log('获取手机号', evt)
    if (evt.detail.errMsg === 'getPhoneNumber:ok') {
      const mobileCode = evt.detail.code

      const loginRes = await uni.login()

      const res = await API.wechatLogin({
        mobile_code: mobileCode,
        open_id_code: loginRes.code,
      })

      if (res.code === 200) {
        console.log(res)
      }
    }
  }

  /**
   * 监听动画结束事件
   */
  const transitionend = () => {
    inputFouksIndex.value = step.value

    if (step.value === 1) {
      codeInputFouks.value = true
    }
  }

  /**
   * 验证码文本框失焦
   */
  const onBlur = () => {
    codeInputFouks.value = false
  }
</script>

<template>
  <div class="login">
    <div
      class="swiper-container"
      :style="{ transform: `translateX(-${step * 100}vw)` }"
      @transitionend.self="transitionend"
    >
      <!-- 1. 输入邮箱 -->
      <div class="swiper-item">
        <div class="header">
          <image
            class="header-logo"
            src="https://img.erpweb.eu.org/imgs/2024/01/245c8a7130242d47.png"
          />

          <h2 class="header-title">Login</h2>
        </div>

        <button open-type="getPhoneNumber" @getphonenumber="getphonenumber">
          快捷登录
        </button>

        <div class="login-form">
          <div class="input-wrapper">
            <input
              class="login-input"
              placeholder-class="input-placeholder"
              type="email"
              :adjust-position="false"
              :focus="inputFouksIndex === 0"
              v-model="loginInfo.email"
              placeholder="email"
              @confirm="sendEmail"
            />
            <!-- @input="emailInput" -->
          </div>

          <!-- 邮箱联想建议 -->
          <!-- <div v-if="showAssociateEmail" class="email-associate">
            <div
              v-for="(item, index) in emailAssociate"
              class="associate-item"
              :key="index"
              @click="setAssociateEmail(loginInfo.email + item)"
            >
              {{ loginInfo.email }}{{ item }}
            </div>
          </div> -->
        </div>
      </div>

      <!-- 2. 提交验证码 -->
      <div class="swiper-item">
        <div class="header" />

        <!-- <div class="code-input-wrapper" @click="codeInputClick">
          <div
            v-for="(item, index) in codeDigits"
            :key="index"
            :class="[
              'code-input',
              {
                'code-input-active':
                  activeCodeIndex === index && codeInputFouks,
              },
            ]"
          >
            {{ loginInfo.code[index] || '' }}
          </div> -->

        <input
          class="input"
          type="number"
          v-model="loginInfo.code"
          maxlength="6"
          :adjust-position="false"
          :focus="codeInputFouks"
          @confirm="onLogin"
          @blur="onBlur"
        />
        <!-- </div> -->

        <div class="get-code-button" @click="sendEmail">
          <template v-if="getCodeButtonLoading">{{ timmer }}s 后再试</template>
          <template v-else>重新获取</template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .login {
    padding-top: 100px;
    box-sizing: border-box;
    overflow: hidden;
    height: 100vh;

    .input {
      border: 1px solid #333;
    }

    // 登录表单轮播图
    .swiper-container {
      height: 80vh;
      width: 400vw;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;

      // 每一项轮播内容
      .swiper-item {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 35px;
        box-sizing: border-box;
        flex-shrink: 0;
        position: relative;

        // 头部内容
        .header {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 150px;
          width: 100%;

          // logo
          &-logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-top: 30px;
            flex-shrink: 0;
          }

          // 标题
          &-title {
            font-size: 22px;
            margin: 20px 0;
          }
        }

        // 提交按钮
        .submit-button {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2d5af1;
          margin-top: 40px;

          .city-icon {
            font-size: 26px;
            color: #fff;
          }
        }

        // 登录表单
        .login-form {
          position: relative;
          width: 100%;

          // 文本框
          .input-wrapper {
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 10px;
            height: 44px;
            padding: 0 20px;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;

            // 输入框
            .login-input {
              height: 100%;
              width: 100%;
              border: none;
              font-size: 15px;
              color: #333;
              outline: none;
              text-align: center;
            }

            .input-placeholder {
              text-align: center;
            }

            &:focus-within {
              border-color: #2d5af1;
            }
          }

          // 邮箱联想建议
          .email-associate {
            margin-top: 7px;
            width: 100%;
            border-radius: 14px;
            background-color: rgb(247, 247, 247);

            .associate-item {
              padding: 12px 15px;
              box-sizing: border-box;
              font-size: 14px;
              color: #111;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 300;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        // 验证码输入框
        .code-input-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;

          // 每一项输入框
          .code-input {
            width: 44px;
            height: 44px;
            background: #f6f6f6;
            border-radius: 12px;
            text-align: center;
            border: 1px solid transparent;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;

            &.code-input-active {
              border-color: #2d5af1;
            }
          }

          // 影子输入框
          .code-input-shadow {
            position: fixed;
            top: -9999px;
            opacity: 0;
            color: transparent;
          }
        }

        // 获取验证码按钮
        .get-code-button {
          margin-top: 40px;
          color: #5a7cec;
          font-size: 14px;
        }
      }
    }
  }
</style>
