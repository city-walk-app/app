import { Http } from '@/utils'

export class Api extends Http {
  constructor() {
    super()
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
   * 获取指定用户信息
   */
  getUserInfo = (data) => {
    return this.request({
      method: 'GET',
      url: '/user/get/user_info',
      data
    })
  }

  /**
   * 获取指定用户去的省份信息
   */
  getUserProvince = (data) => {
    return this.request({
      method: 'GET',
      url: '/gps/get_user_province',
      data
    })
  }

  /**
   * 获取地图数据
   */
  getMapData = (data) => {
    return this.request({
      method: 'GET',
      url: '/gps/get_map_data',
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

  /**
   * 获取用户当天发布位置记录
   */
  getRoute = () => {
    return this.request({
      method: 'GET',
      url: '/gps/get_route'
    })
  }

  /**
   * 获取用户步行记录
   */
  getRouteList = (data) => {
    return this.request({
      method: 'GET',
      url: '/gps/get_route_list',
      data
    })
  }

  /**
   * 获取打卡历史记录
   */
  getRouteHistory = (data) => {
    return this.request({
      method: 'GET',
      url: '/gps/get_route_history',
      data
    })
  }

  /**
   * 通过经纬度获取位置信息
   */
  getLocationInfo = (data) => {
    return this.request({
      method: 'GET',
      url: '/gps/get_location_info',
      data
    })
  }

  /**
   * 获取经验值列表
   */
  getExperience = (data) => {
    return this.request({
      method: 'GET',
      url: '/experience/get_experience',
      data
    })
  }

  /**
   * 收集经验
   */
  collectExperience = (data) => {
    return this.request({
      method: 'POST',
      url: '/experience/collect',
      data
    })
  }

  /**
   * 获取经验排行榜
   */
  getRanking = (data) => {
    return this.request({
      method: 'GET',
      url: '/experience/ranking',
      data
    })
  }

  /**
   * 获取主题
   */
  getTitleList = (data) => {
    return this.request({
      method: 'POST',
      url: '/title/get/list',
      data
    })
  }

  /**
   * 获取用户的动态发布日历热力图
   */
  userGetCalendarHeatmap = (data) => {
    return this.request({
      method: 'GET',
      url: '/user/get_calendar_heatmap',
      data
    })
  }
}
