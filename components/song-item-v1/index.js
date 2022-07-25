// components/song-item-v1/index.js
import {playerStore} from "../../store/index"
Component({

properties:{
  item:{
    type:Object,
    value:{}
  }
},
methods:{
  handleSongItemClick(){
    const id=this.properties.item.id
    //页面跳转
    wx.navigateTo({
      url: '/pages/music-player/index?id='+id,
    })
    //对歌曲的数据请求和其他操作
    playerStore.dispatch("playMusicWithSongIdAction",{id})
    }
  }
})