import tRquest from "./index"
//请求视频mv相关信息
export function getTopMv(offset,limit=10) {
   return tRquest.get("/top/mv",{
     offset,
     limit
   })
}
//请求播放视频的地址
export function getMVURL(id) {
  return tRquest.get("/mv/url",{
    id
  })
}
//请求播放视频的详情数据
export function getMVDetail(mvid) {
  return tRquest.get("/mv/detail",{
    mvid
  })
}
//请求相关视频的数据
export function getMVRelated(id) {
  return tRquest.get("/related/allvideo",{
    id
  })
}