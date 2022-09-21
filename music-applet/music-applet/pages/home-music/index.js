// pages/home-music/index.js
import {rankingStore } from "../../store/index"
import { getBanners ,getSongMenu} from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"
//节流函数:
const throttleQueryRect=throttle(queryRect,1000)
const rankingMap = { 3779629: "newRanking",
                     3778678: "hotRanking", 
                     2884035: "originRanking", 
                     19723756: "upRanking" }
Page({
  data: {
  swiperHeight:0,
  banners:[],
  hotSongMenu:[],
  recommendSongMenu:[],
  recommendSongs:[],
  //遍历顺序一致
  rankings:{3779629:{},2884035:{},19723756:{}}
  },
  onLoad(options) {
    //获取页面轮播图的数据
   this.getPageData()

   //发起共享数据请求
   rankingStore.dispatch("getRankingDataAction")

   //从store中获取共享的数据
   //如果有一天别人改了store的值,这里会重新执行获取到最新的值
   rankingStore.onState("hotRanking",(res)=>{
     if(!res.tracks) return  //第一次res是空对象,不是数组 slice就会报错
    const recommendSongs=res.tracks.slice(0,6)
    this.setData({recommendSongs:recommendSongs})
   })
   rankingStore.onState("newRanking",this.getRankingHandler(3779629))
   rankingStore.onState("originRanking",this.getRankingHandler(2884035))
   rankingStore.onState("upRanking",this.getRankingHandler(19723756))
  },
  //网络请求
  getPageData(){
    //获取轮播图数据
    getBanners().then(res=>{
     this.setData({banners:res.banners})
    })
    //获取热门歌单 -->cat为全部类别
    getSongMenu().then(res=>{
    //  console.log(res);
    this.setData({hotSongMenu:res.playlists})
    })
     //获取推荐歌单 -->cat为话语类别 
     getSongMenu("华语").then(res=>{
      this.setData({recommendSongMenu:res.playlists})
      })
  },
  //事件处理
  //点击搜索框-->跳转到搜索详情页
  handleSearchClick(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  //每次图片加载完都调用这个函数,调用频率太高
  handleSwiperLoaded(){
    //获取组件的高度
    throttleQueryRect(".swiper-image").then(res=>{
      console.log("查询结果");
      this.setData({swiperHeight:res[0].height})
    })
  },
   //点击更多-->跳转到推荐歌曲(和热门歌曲是一样的数据)
  handleMoreClick(){
    // console.log("监听到推荐歌曲的事件点击");
    this.navigateToDetailSongPage("hotRanking")
  },
  handleRankingItemClick(event){
    //点击巅峰榜整个组件的任意部分 -->跳转到指定页面
    // console.log(event.currentTarget.dataset.id); //ranking:key的值
    const id=event.currentTarget.dataset.id
    const rankingName=rankingMap[id]
    this.navigateToDetailSongPage(rankingName)
  },
  navigateToDetailSongPage(rankingName){
    wx.navigateTo({
      url:`/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  getRankingHandler(id){
    return (res)=>{
         if(Object.keys(res).length === 0) return
            const name=res.name
            const coverImgUrl=res.coverImgUrl
            const playCount=res.playCount
            const songList=res.tracks.slice(0,3)
            const rankingObj={name,coverImgUrl,playCount,songList}
            const newRankings={...this.data.rankings,[id]:rankingObj}
            this.setData({ rankings:newRankings})
          }
    }
  // getNewRankingHandler(res){
  //   if(Object.keys(res).length === 0) return
  //   const name=res.name
  //   const coverImgUrl=res.coverImgUrl
  //   const songList=res.tracks.slice(0,3)
  //   const rankingObj={name,coverImgUrl,songList}
  //   const originRankings=[...this.data.rankings]
  //   originRankings.push(rankingObj)
  //   this.setData({ rankings:originRankings})
  // }
})