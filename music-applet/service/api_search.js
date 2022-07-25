import tRequset from "./index"
//热门词
export function getSearchHot(){
  return tRequset.get("/search/hot")
}
//搜索建议
export function getSearchSuggest(keywords){
  return tRequset.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}
//搜索歌曲接口
export function getSearchResult(keywords){
  return tRequset.get("/search",{
    keywords
  })
}