import { Http } from '@/utils'

export class Api extends Http {
  constructor() {
    super()
  }

  /**
   * 获取 AccessToken
   */
  getWxAccessToken = (data) => {
    return this.request({
      method: 'POST',
      url: '/wx/get/access_token',
      data
    })
  }

  /**
   * 拒绝加好友
   */
  friendRefuseInvite = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/refuse/invite',
      data
    })
  }

  /**
   * 获取朋友经验排名
   */
  getFriendExperienceRanking = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/get/experience/ranking',
      data
    })
  }

  /**
   * 获取朋友列表
   */
  friendList = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/list',
      data
    })
  }

  /**
   * 同意邀请
   */
  friendConfirmInvite = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/confirm/invite',
      data
    })
  }

  /**
   * 获取邀请详情
   */
  getFriendInviteInfo = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/get/invite/info',
      data
    })
  }

  /**
   * 邀请朋友
   */
  friendInvite = (data) => {
    return this.request({
      method: 'POST',
      url: '/friend/invite',
      data
    })
  }

  /**
   * 获取用户步行记录列表
   */
  getUserRouteDetail = (data) => {
    return this.request({
      method: 'POST',
      url: '/location/get/user/route/detail',
      data
    })
  }

  /**
   * 获取用户步行记录列表
   */
  getUserRouteList = (data) => {
    return this.request({
      method: 'POST',
      url: '/location/get/user/route/list',
      data
    })
  }

  /**
   * 获取用户解锁的省份版图列表
   */
  getUserProvinceJigsaw = (data) => {
    return this.request({
      method: 'POST',
      url: '/location/get/user/province/jigsaw',
      data
    })
  }

  /**
   * 获取用户信息
   */
  getUserInfo = (data) => {
    return this.request({
      method: 'POST',
      url: '/user/get/user_info',
      data
    })
  }

  /**
   * 设置用户信息
   */
  setUserInfo = (data) => {
    return this.request({
      method: 'POST',
      url: '/user/info/set_user_info',
      data
    })
  }

  /**
   * 获取邮件验证码
   */
  sendEmail = (data) => {
    return this.request({
      method: 'POST',
      url: '/email/send',
      data
    })
  }

  /**
   * 邮箱登录
   */
  emailLogin = (data) => {
    return this.request({
      method: 'POST',
      url: '/user/login/email',
      data
    })
  }

  /**
   * 创建当前位置信息
   */
  locationCreateRecord = (data) => {
    return this.request({
      method: 'POST',
      url: '/location/create/record',
      data
    })
  }
}
