// base-ui/nav-bar/index.js
Component({
  options:{
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:getApp().globalData.statusBarHeight,
    navBarHeight:getApp().globalData.NavBarHeight
  },
  // lifetimes:{
  //   ready(){
  //     const info= wx.getSystemInfoSync()
  //     console.log(info);
  //   }
  // },
  methods: {

  }
})
