App({
  globalData:{
    statusBarHeight:0,
    screenHeight:0,
    screenWidth:0,
    NavBarHeight:42,
    deviceRadio:0
  },
  async onLaunch(){
    //1.获取设备信息
    const info =wx.getSystemInfoSync()
    //设置状态栏高度
    this.globalData.statusBarHeight=info.statusBarHeight
    this.globalData.screenHeight=info.screenHeight
    this.globalData.screenWidth=info.screenWidth

    //宽高比
    const deviceRadio=info.screenHeight/info.screenWidth
    this.globalData.deviceRadio=deviceRadio
  },
})
