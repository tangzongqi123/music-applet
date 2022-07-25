// components/song-item-v1/index.js
Component({

properties:{
  item:{
    type:Object,
    value:{}
  }
},
methods:{
  handleSongItemClick(){
    // console.log("song-item-v1 click");
    const id=this.data.item.id
    wx.navigateTo({
      url: '/pages/music-player/index?id='+id,
    })
  }
}
})