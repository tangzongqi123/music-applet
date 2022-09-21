import tRequest from "./index"
export function getBanners(){
 return tRequest.get("/banner",{
   type:2
 })
}

export function getRankings(id){
  return tRequest.get("/playlist/detail",{
    id
  })
}
export function getSongMenu(cat="全部",limit=6,offset=0){
  return tRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}
// 请求歌单
export function getSongMenuDetail(id){
  return tRequest.get("/playlist/detail",{
    id
  })
}