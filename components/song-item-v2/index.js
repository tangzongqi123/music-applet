// components/song-item-v2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index:{
      type:Number,
      value:0
    },
    item:{
      type:Object,
      value:{}
    }
  },
  data: {
  },
  methods: {
    handleSongItemClick(){
      console.log("song-item-v2 click");
      const id=this.data.item.id
      wx.navigateTo({
        url: '/pages/music-player/index?id='+id,
      })
    }
  }
})
