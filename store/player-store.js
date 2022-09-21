import { HYEventStore } from 'hy-event-store'
import {getSongDetail,getSongLyric} from "../service/api_player"
import {parseLyric} from "../utils/parse-lyric"
// const audioContext=wx.createInnerAudioContext() //前台播放
const audioContext=wx.getBackgroundAudioManager() //后台播放
const playerStore = new HYEventStore({
  state: {
    isFirstPlay:true,
    isStoping:false,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex:0,
    currentLyricText:"",

    playModeIndex:0, //0:循环播放 1:单曲循环 2:随机播放
    playListSongs:[],
    playListIndex:0,

    isPlaying:false
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      //如果传入的id是相同的,下面就没必要继续再操作了
      if(ctx.id === id) {
        this.dispatch("changeMusicPlayStatusAction",true)
        return
      }
      ctx.id = id

      //0.修改播放的状态
      ctx.isPlaying=true
      ctx.currentSong={}
      ctx.durationTime=0
      ctx.lyricInfos=[]
      ctx.currentTime=0
      ctx.currentLyricIndex=0
      ctx.currentLyricText=""

      //1.通过id请求歌曲相关信息
      //获取歌曲详情
     getSongDetail(id).then(res=>{
       ctx.currentSong = res.songs[0]
       ctx.durationTime = res.songs[0].dt
       audioContext.title=res.songs[0].name
    })
    //获取歌词
    getSongLyric(id).then(res=>{
      const lyricString=res.lrc.lyric
      const lyrics=parseLyric(lyricString)
      ctx.lyricInfos = lyrics
    })
    //2.播放对应id的歌曲
      audioContext.stop()
      audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title=id
      audioContext.autoplay=true //自动播放
    
    
    //3.监听audioContext一些事件
    if(ctx.isFirstPlay){
      this.dispatch("setupAudioContextListenerAction")
      ctx.isFirstPlay=false
    }

    //4.监听音乐暂停/播放/停止
    //播放状态
    audioContext.onPlay(()=>{
      ctx.isPlaying=true
    })
    audioContext.onPause(()=>{
      ctx.isPlaying=false
    })
    audioContext.onStop(()=>{
      ctx.isPlaying=false
      ctx.isStoping=true
    })
      
  },

    setupAudioContextListenerAction(ctx){
        //1.监听歌曲可以播放
        audioContext.onCanplay(()=>{
          audioContext.play() //准备好了就播放 -->为了防止播放失效
        })
        //2.监听时间改变
        audioContext.onTimeUpdate(()=>{
          //2.1获取当前时间
          const currentTime=(audioContext.currentTime) * 1000
    
          //2.2根据当前时间修改currentTime
          ctx.currentTime=currentTime

          //3根据当前时间查找播放歌词
          if (!ctx.lyricInfos.length) return
          for(let i=0;i<ctx.lyricInfos.length;i++){
            const lyricInfo=ctx.lyricInfos[i]
            if(currentTime<lyricInfo.time){
              //设置当前的歌词的索引和内容
              const currentIndex=i-1
              //解决重复设置歌词的问题
              if(ctx.currentLyricIndex!== currentIndex){
                const currentLyricInfo=ctx.lyricInfos[currentIndex]
                ctx.currentLyricIndex=currentIndex
                ctx.currentLyricText=currentLyricInfo.text  
            }
            break   
          }
    }
        })
        //3.监听歌曲播放完成
        audioContext.onEnded(()=>{
          this.dispatch("changeNewMusicAction")
        })
      
  },
  changeMusicPlayStatusAction(ctx ,isPlaying=true){
    ctx.isPlaying=isPlaying
    if( ctx.isPlaying && ctx.isStoping){
      audioContext.src=`https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
      audioContext.title=currentSong.name
      audioContext.seek(ctx.currentTime)
      ctx.isStoping=false
    }
    if(ctx.isPlaying){
      audioContext.play()
    }else{
      audioContext.pause()
    }
  },
  changeNewMusicAction(ctx,isNext=true){
    //1.获取当前音乐的索引
    let index=ctx.playListIndex

    //2.根据不同的播放模式,获取下一首歌的索引
    switch (ctx.playModeIndex) {
      case 0: //顺序播放
        index=isNext ? index +1 :index -1
        if(index === -1) index =ctx.playListSongs.length-1
        if(index === ctx.playListSongs.length) index=0
        break
      case 1: //单曲循环
        break
      case 2: //随机播放
        index=Math.floor(Math.random() *ctx.playListSongs.length)
        break;
    }
    //3.获取歌曲
    let currentSong=ctx.playListSongs[index]
    if(!currentSong) {
      currentSong=ctx.currentSong
    }else{
      ctx.playListIndex=index
    }
    //4.播放新的歌曲
    this.dispatch("playMusicWithSongIdAction",{id:currentSong.id})
  }
}
})
export{
  audioContext,
  playerStore
}