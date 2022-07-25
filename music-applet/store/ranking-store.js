import {HYEventStore} from "hy-event-store"

import {getRankings} from "../service/api_music"
/**
 * 新歌 id=3779629
   热歌 id=3778678
   原创 id=2884035
   飙升 id=19723756
 */
// const rankingMap = { 3779629: "newRanking",
//                      3778678: "hotRanking", 
//                      2884035: "originRanking", 
//                      19723756: "upRanking" }
let arrID=[3779629,3778678,2884035,19723756]

const rankingStore= new HYEventStore({
  state:{
    newRanking:{},
    hotRanking:{},
    originRanking:{},
    upRanking:{}
  },
  actions:{
    getRankingDataAction(ctx){
      for(const item of arrID){
        getRankings(item).then(res=>{
          switch (item) {
              case 3779629: //新歌榜
              ctx.newRanking=res.playlist
                break;
              case 3778678: //热门榜
              ctx.hotRanking=res.playlist
                break;
              case 2884035: //原创榜
              ctx.originRanking=res.playlist
                break;
              case 19723756: //飙升榜
              ctx.upRanking=res.playlist
                break;
          }
      })
    }
      }
    }
})
export {
  rankingStore,
}