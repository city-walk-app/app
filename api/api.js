import { Http } from '@/utils'

export class Api extends Http {
  constructor() {
    super()
  }

  /**
   * 上传公开文件
   */
  universalContentUpload = (data) => {
    return this.request({ url: '/universal/content/upload', data })
  }

  /**
   * 完善步行打卡记录详情
   */
  updateRouteDetail = (data) => {
    return this.request({ url: '/location/update/user/route/detail', data })
  }

  /**
   * 获取当前地区的天气
   */
  getWeatherInfo = (data) => {
    return this.request({ url: '/location/get/weather/info', data })
  }

  /**
   * 获取周边热门地点
   */
  getLocationPopularRecommend = (data) => {
    return this.request({ url: '/location/get/popular/recommend', data })
  }

  /**
   * 获取用户指定月份打卡热力图
   */
  getLocationUserHeatmap = (data) => {
    return this.request({ url: '/location/get/user/heatmap', data })
  }

  /**
   * open id 登录
   */
  loginOpenId = (data) => {
    return this.request({ url: '/user/login/open_id', data })
  }

  /**
   * 获取 open id
   */
  getOpenId = (data) => {
    return this.request({ url: '/wx/get/open_id', data })
  }

  /**
   * 获取邀请二维码
   */
  getInviteQrCode = (data) => {
    return this.request({ url: '/wx/get/invite/qr_code', data })
  }

  /**
   * 拒绝加好友
   */
  friendRefuseInvite = (data) => {
    return this.request({ url: '/friend/refuse/invite', data })
  }

  /**
   * 获取朋友经验排名
   */
  getFriendExperienceRanking = (data) => {
    return this.request({ url: '/friend/get/experience/ranking', data })
  }

  /**
   * 获取朋友列表
   */
  friendList = (data) => {
    return this.request({ url: '/friend/list', data })
  }

  /**
   * 同意邀请
   */
  friendConfirmInvite = (data) => {
    return this.request({ url: '/friend/confirm/invite', data })
  }

  /**
   * 获取邀请详情
   */
  getFriendInviteInfo = (data) => {
    return this.request({ url: '/friend/get/invite/info', data })
  }

  /**
   * 邀请朋友
   */
  friendInvite = (data) => {
    return this.request({ url: '/friend/invite', data })
  }

  /**
   * 获取用户步行记录列表
   */
  getUserRouteDetail = (data) => {
    return this.request({ url: '/location/get/user/route/detail', data })
  }

  /**
   * 获取用户步行记录列表
   */
  getUserRouteList = (data) => {
    return this.request({ url: '/location/get/user/route/list', data })
  }

  /**
   * 获取用户解锁的省份版图列表
   */
  getUserProvinceJigsaw = (data) => {
    return this.request({ url: '/location/get/user/province/jigsaw', data })
  }

  /**
   * 获取用户信息
   */
  getUserInfo = (data) => {
    return this.request({ url: '/user/get/user_info', data })
  }

  /**
   * 设置用户信息
   */
  setUserInfo = (data) => {
    return this.request({ url: '/user/set/user_info', data })
  }

  /**
   * 获取邮件验证码
   */
  sendEmail = (data) => {
    return this.request({ url: '/email/send', data })
  }

  /**
   * 邮箱登录
   */
  emailLogin = (data) => {
    return this.request({ url: '/user/login/email', data })
  }

  /**
   * 创建当前位置信息
   */
  locationCreateRecord = (data) => {
    return this.request({ url: '/location/create/record', data })
  }
}
