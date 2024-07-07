<script setup>
  import { reactive, ref, watch } from 'vue'
  import { Api } from '@/api'
  import { isValidEmail } from '@/utils'
  import { onShow } from '@dcloudio/uni-app'
  import {
    VUE_APP_API_URL,
    toast,
    showLoading,
    hideLoading,
    getStorage,
    setStorage,
  } from '@/utils'
  import { USER_INFO } from '@/enum'
  import IConfetti from '@/uni_modules/lime-confetti/components/l-confetti/l-confetti.vue'

  const API = new Api()

  /** 菜单礼花元素节点 */
  const confettiRef = ref()
  /** 登录按钮禁用状态 */
  const disabled = ref(false)
  /** 登陆信息 */
  const loginInfo = reactive({ email: '', code: '' })
  /** 步骤 */
  const step = ref(0)
  /** 昵称 */
  const nickName = ref('')
  /** 用户身份信息 */
  const userInfo = ref()
  /** 头像路径 */
  const avatarUrl = ref('')
  /** 头像文件 */
  const avatarFile = ref()
  /** 按钮倒计时 */
  const timmer = ref(60)
  /**获取验证码按钮禁用状态 */
  const getCodeButtonLoading = ref(false)
  /** 倒计时定时器 */
  let timeout
  /** 是否显示联想建议邮箱 */
  // const showAssociateEmail = ref(false)
  /** 验证码长度 */
  const codeDigits = 6
  /** 验证码聚焦索引 */
  const activeCodeIndex = ref(0)
  /** 联想邮箱 */
  // const emailAssociate = [
  //   '@qq.com',
  //   '@163.com',
  //   '@gmail.com',
  //   '@126.com',
  //   '@yahoo.com',
  //   '@sina.com',
  //   '@hotmail.com',
  //   '@foxmail.com',
  // ]
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
    if (!isValidEmail(loginInfo.email)) {
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
    if (!isValidEmail(loginInfo.email)) {
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
      setStorage(USER_INFO, res.data)

      uni.navigateTo({
        url: '/pages/home/index',
      })

      // // 如果是新用户，则进行下一步
      // if (res.data.is_new_user) {
      //   toast('注册成功，请完善信息')
      //   step.value = 2
      // } else {
      //   toast(res.message)

      //   if (confettiRef.value) {
      //     // 播放完成注册庆祝烟花
      //     confettiRef.value.play({
      //       particleCount: 100,
      //       spread: 70,
      //       shapes: ['circle'],
      //       origin: {
      //         y: 0.6,
      //       },
      //     })

      //     setTimeout(() => {
      //       uni.navigateTo({
      //         url: '/pages/layout/index',
      //       })
      //     }, 1500)
      //   }
      // }
      return
    }

    toast(res.message)
  }

  /**
   * 设置名字
   */
  const onSetName = async () => {
    showLoading('处理中...')

    const res = await API.setUserInfo({
      id: userInfo.value.id,
      nick_name: nickName.value,
    })

    hideLoading()

    if (res.code === 200) {
      toast('设置成功')
      step.value = 3
    }
  }

  /**
   * 上传头像
   */
  const upLoadAvatar = () => {
    uni.chooseImage({
      count: 1, // 文件个数
      mediaType: ['image'], // 类型
      sourceType: ['album', 'camera'], // 相册和拍照选择
      camera: 'back', // 后置摄像头
      success: (res) => {
        avatarUrl.value = res.tempFilePaths[0]
        avatarFile.value = res.tempFiles[0]
      },
    })
  }

  /**
   * 提交头像，完成注册
   */
  const onSubmit = () => {
    showLoading('处理中...')

    uni.uploadFile({
      url: VUE_APP_API_URL + '/user/info/up_avatar', // 上传文件的服务器地址
      filePath: avatarUrl.value, // 本地文件路径
      name: 'image', // 上传文件字段的名称
      header: {
        token: getStorage(USER_INFO).token,
      }, // 表单数据
      success: (response) => {
        // 上传成功后的处理逻辑
        const res = JSON.parse(response.data)

        hideLoading()

        if (res.code === 200) {
          toast('设置成功')

          if (confettiRef.value) {
            // 播放完成注册庆祝烟花
            confettiRef.value.play({
              particleCount: 100,
              spread: 70,
              shapes: ['circle'],
              origin: {
                y: 0.6,
              },
            })

            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/layout/index',
              })
            }, 1500)
          }
        }
      },
    })
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

  /**
   * 点击设置邮箱
   */
  // const setAssociateEmail = (email: string) => {
  //   loginInfo.email = email
  //   showAssociateEmail.value = false

  //   sendEmail()
  // }

  /**
   * 邮箱文本框输入
   */
  // const emailInput = () => {
  //   showAssociateEmail.value = true
  // }

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

  /**
   * 点击验证码输入框聚焦
   */
  const codeInputClick = () => {
    codeInputFouks.value = true
  }
</script>

<template>
  <div class="login">
    <!-- 散花效果 -->
    <IConfetti ref="confettiRef" class="canvas-fetti" />

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

    // 彩带飘落画板
    .canvas-fetti {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: -10;
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

        // 头像选择
        .up-avatar {
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background-color: #eee;

          // 图片元素
          .up-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
      }
    }
  }
</style>
