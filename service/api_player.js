import tRequest from "./index"

//获取歌曲详情
export function getSongDetail(ids){
  return tRequest.get("/song/detail",{
    ids
  })
}

//获取歌词
export function getSongLyric(id){
  return tRequest.get("/lyric",{
    id
  })
}