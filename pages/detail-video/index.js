// pages/detail-video/index.js
import {getMVURL,getMVDetail,getMVRelated} from "../../service/api_vedio"
Page({
  /**
   * 页面的初始数据
   */
  data: {
     mvurl:"",
     details:{},
     relate:[]
  },
  /**
   * 生命周期函数--监听页面加载
   * options:能够拿到传入的参数
   */
  onLoad(options) {
    //通过options获取id
    const id=options.id
    //获取页面的数据
    this.getPageData(id)
  },
  //获取数据的方法
  getPageData(id){
    //请求播放地址
    getMVURL(id).then(res=>{
      this.setData({mvurl:res.data.url})
    })
    //请求视频信息
    getMVDetail(id).then(res=>{
      this.setData({details:res.data})
    })
    //请求相关视频
    getMVRelated(id).then(res=>{
      this.setData({relate:res.data})
    })
  }
  
})