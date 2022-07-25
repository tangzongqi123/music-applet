// pages/music-player/index.js
import {getSongDetail,getSongLyric} from "../../service/api_player"
import {parseLyric} from "../../utils/parse-lyric"
import {audioContext} from "../../store/index"
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
    this.getPageData(id)

    //3.动态计算内容高度
    const globalData=getApp().globalData
    const screenHeight=globalData.screenHeight
    const statusBarHeight=globalData.statusBarHeight
    const NavBarHeight=globalData.NavBarHeight
    const deviceRadio=globalData.deviceRadio
    const contentHeight=screenHeight-statusBarHeight-NavBarHeight
    this.setData({contentHeight,isMusicLyric:deviceRadio>=2})

    //4.使用播放歌曲
    audioContext.stop()
    audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.play() //立即播放
    // audioContext.autoplay=true //自动播放
    // //5.audioContext的事件监听
    // this.setupAudioContextListener()

  },

  //网络请求
  getPageData(id){
    //获取歌曲相关信息
    getSongDetail(id).then(res=>{
      this.setData({currentSong:res.songs[0],durationTime:res.songs[0].dt})
    })
    //获取歌词的信息
    getSongLyric(id).then(res=>{
      const lyricString=res.lrc.lyric
      const lyrics=parseLyric(lyricString)
      // console.log(lyrics);
      // console.log(lyricString);
      this.setData({lyricInfos:lyrics})
    })
  },
  //事件监听
  setupAudioContextListener(){
    audioContext.onCanplay(()=>{
      audioContext.play() //准备好了就播放 -->为了防止播放失效
    })
    //监听时间改变
    audioContext.onTimeUpdate(()=>{
      //1.获取当前时间
      const currentTime=(audioContext.currentTime) * 1000

      //2.根据当前时间修改currentTime/sliderValue
      if(!this.data.isSliderChanging){
        const silderValue=currentTime/this.data.durationTime *100
        this.setData({silderValue,currentTime})
      }

      //3.根据当前时间查找播放歌词
      for(let i=0;i<this.data.lyricInfos.length;i++){
        const lyricInfo=this.data.lyricInfos[i]
        if(currentTime<lyricInfo.time){
          // console.log(i);
          //设置当前的歌词的索引和内容
          const currentIndex=i-1
          //解决重复设置歌词的问题
          if(this.data.currentLyricIndex!== currentIndex){
          const currentLyricInfo=this.data.lyricInfos[currentIndex]
          // console.log(currentLyricInfo.text);
          this.setData({currentLyricText:currentLyricInfo.text,
                       currentLyricIndex:currentIndex,
                       lyricScrollTop:currentIndex*35})
          }
          break   
        }
      }
  
    })
  },
 /* ************事件处理 *************** */
  handleSwiperChange(event){
    // console.log(event.detail.current); // 1 / 2 
    const current=event.detail.current
   
    this.setData({currentPage:current})
  },

  handleSliderChanging(event){
    const value=event.detail.value
    //  console.log("silder change", value);
    const currentTime=this.data.durationTime * value/100
    this.setData({isSliderChanging:true,currentTime, sliderValue: value})
  },

  handleSliderChange(event){
    //1.获取silder变化的值
    const value=event.detail.value
    // console.log("silder change", value);
    //2.计算需要播放的currentTime
    const currentTime=this.data.durationTime * value/100
    //3.设置context播放currentTime位置的音乐
    audioContext.pause()
    audioContext.seek(currentTime/1000)//跳转到指定位置
    //4.记录最新的silderValue
    this.setData({silderValue:value,isSliderChanging:false})
  }
})