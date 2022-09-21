// pages/music-player/index.js

import {audioContext,playerStore} from "../../store/index"

const playModeNames=["order","repeat","random"]

Page({

  data: {
    //歌曲相关
    id:0,
    currentSong:{},
    durationTime:0,
    currentTime:0,
    lyricInfos:[],
    currentLyricIndex:0,
    currentLyricText:"",

    playModeIndex:0,
    isPlaying:false,
    playModeName:"order",
    playingName:"pause",

    //页面相关
    currentPage:0,
    contentHeight:0,
    isMusicLyric:true,
    silderValue:0,
    isSliderChanging:false,
    lyricScrollTop:0
  },
  onLoad(options) {
    //1.获取url参数传入的id
    const id = options.id
    this.setData({id})
    //2.根据id获取歌曲信息
   this.setupPlayerStoreListener()

    //3.动态计算内容高度
    const globalData=getApp().globalData
    const screenHeight=globalData.screenHeight
    const statusBarHeight=globalData.statusBarHeight
    const NavBarHeight=globalData.NavBarHeight
    const deviceRadio=globalData.deviceRadio
    const contentHeight=screenHeight-statusBarHeight-NavBarHeight
    this.setData({contentHeight,isMusicLyric:deviceRadio>=2})
  },

  //事件监听

 /* ************事件处理 *************** */
  handleSwiperChange(event){
    // console.log(event.detail.current); // 1 / 2 
    const current=event.detail.current
   
    this.setData({currentPage:current})
  },

  handleSliderChanging(event){
    const value=event.detail.value
    const currentTime=this.data.durationTime * value/100
    this.setData({isSliderChanging:true,currentTime})
  },

  handleSliderChange(event){
    //1.获取silder变化的值
    const value=event.detail.value
    // console.log("silder change", value);
    //2.计算需要播放的currentTime
    const currentTime=this.data.durationTime * value/100
    //3.设置context播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime/1000)//跳转到指定位置
    //4.记录最新的silderValue
    this.setData({silderValue:value,isSliderChanging:false})
  },
  //事件监听
  handleBackClick(){
    //返回上一级
    wx.navigateBack()
  },
  handleModeBtnClick(){
    //计算最新playModeIndex
    let playModeIndex=this.data.playModeIndex+1
    if(playModeIndex === 3) playModeIndex=0

    //设置playStore中的playModeIndex
    playerStore.setState("playModeIndex",playModeIndex)
  },
  handlePlayBtnClick(){
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
  },
  handlePrevBtnClick(){
    playerStore.dispatch("changeNewMusicAction",false)
  },
  handleNextBtnClick(){
    playerStore.dispatch("changeNewMusicAction")
  },

  setupPlayerStoreListener(){
  //1.监听 currentSong / durationTime / lyricInfos
  playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
  currentSong,
  durationTime,
  lyricInfos
}) => {
  if(currentSong) this.setData({currentSong})
  if(durationTime) this.setData({durationTime})
  if(lyricInfos) this.setData({lyricInfos})
  })
  //2.监听 currentTime / currentLyricIndex /currentLyricText
  playerStore.onStates(["currentTime","currentLyricIndex", "currentLyricText"],({
    currentTime,
    currentLyricIndex,
    currentLyricText
  })=>{
    //时间变化
    if(currentTime && !this.data.isSliderChanging) {
      const silderValue=currentTime / this.data.durationTime *100
      this.setData({currentTime,silderValue})}
    //歌词变化
    if(currentLyricIndex){
      this.setData({currentLyricIndex,lyricScrollTop:currentLyricIndex*35})
    }
    if(currentLyricText){
      this.setData({currentLyricText}) 
    } 
  })
    //3.监听播放模式相关数据
    playerStore.onStates(["playModeIndex","isPlaying"],({playModeIndex,isPlaying})=>{
      if(playModeIndex !== undefined){
        this.setData({
          playModeIndex,
          playModeName:[playModeNames[playModeIndex]]})
      }
      if(isPlaying !==undefined){
        this.setData({
          isPlaying,
          playingName:isPlaying?'pause':'resume'
        })
      }
     
    })
  }

})