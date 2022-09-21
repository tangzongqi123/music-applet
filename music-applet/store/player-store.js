import { HYEventStore } from 'hy-event-store'
import {getSongDetail,getSongLyric} from "../service/api_player"
import {parseLyric} from "../utils/parse-lyric"
const audioContext=wx.createInnerAudioContext()
const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex:0,
    currentLyricText:"",

    playModeIndex:0, //0:循环播放 1:单曲循环 2:随机播放
    isPlaying:false
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      ctx.id = id
      //0.修改播放的状态
      ctx.isPlaying=true
      //1.通过id请求歌曲相关信息
      //获取歌曲详情
     getSongDetail(id).then(res=>{
       console.log(res);
       ctx.currentSong = res.songs[0]
       ctx.durationTime = res.songs[0].dt
      
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
      audioContext.autoplay=true //自动播放
    
    //3.监听audioContext一些事件
    this.dispatch("setupAudioContextListenerAction")   
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
      
  },
  changeMusicPlayStatusAction(ctx){
    ctx.isPlaying=!ctx.isPlaying
    if(ctx.isPlaying){
      audioContext.play()
    }else{
      audioContext.pause()
    }
  }
}
})
export{
  audioContext,
  playerStore
}