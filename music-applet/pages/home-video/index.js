// pages/home-video/index.js
import {getTopMv} from "../../service/api_vedio"
Page({
  /**
   * 页面的初始数据
   */
  data: {
  topMVs:[],
  hasMore:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
 onLoad(options) {
    this.getTopMVData(0)
  },
//封装一个网络请求方法
async getTopMVData(offset){
  //判断是否可以请求
  //直接返回
  if(!this.data.hasMore && offset !== 0) return
  //展示加载动画
  wx.showNavigationBarLoading()
  //真正请求数据
  const res=await getTopMv(offset)
  let newData=this.data.topMVs
  if(offset === 0){
    newData=res.data
  }else{
    newData=newData.concat(res.data)
  }
  //设置数据
  this.setData({topMVs:newData})
  this.setData({hasMore:res.hasMore})
  wx.hideNavigationBarLoading()
},
//封装事件处理的方法
handleViedeoItemClick(event){
 //获取id
const id=event.currentTarget.dataset.item.id
//页面跳转
wx.navigateTo({
  url: '/pages/detail-video/index?id='+id,
})
},
//其它生命周期回调函数
 onPullDownRefresh(){
 this.getTopMVData(0)
},
 onReachBottom() {
  this.getTopMVData(this.data.topMVs.length)
  },
})