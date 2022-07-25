// pages/detail-songs/index.js
import {rankingStore} from "../../store/index"
import{getSongMenuDetail} from "../../service/api_music"
Page({
  data: {
    type:"",
    ranking:"",
    songInfo:{}
  },
  onLoad(options) {
    //获取到url参数type
    const type=options.type
    this.setData({type})
    //根据type做不同的判断
    if(type === "menu"){ //推荐歌单/热门歌单-->歌曲列表
      const id =options.id
      // console.log(id);
      getSongMenuDetail(id).then(res=>{ //获取id对应的数据
       this.setData({songInfo:res.playlist})
      })
    }else if(type === "rank"){ //热门歌曲/巅峰榜 -->歌曲列表
      const ranking=options.ranking
      this.setData({ranking:ranking})
      // console.log(ranking);
      rankingStore.onState(this.data.ranking,this.getRankingDataHandler)
    }
   
  },
  getRankingDataHandler(res){
    // console.log(res);
    this.setData({songInfo:res})
  }

})