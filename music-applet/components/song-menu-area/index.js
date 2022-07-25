// components/song-menu-area/index.js
Component({
  properties:{
    title:{
      type:String,
      value:"默认歌单"
    },
    songMenu:{
      type:Array,
      value:[]
    }
  },
  methods:{
    handleMenuItemClick(event){
      // console.log("歌单item的点击");
      const item =event.currentTarget.dataset.item
      // console.log(item);
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
      })
    }
  }
})