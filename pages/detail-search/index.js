// pages/detail-search/index.js
import {getSearchHot,getSearchSuggest,getSearchResult} from "../../service/api_search"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string-to-nodes"

//返回经过防抖处理的函数
const debounceGetSearchSuggest=debounce(getSearchSuggest,300)
Page({
  data: {
    hotKeywords:[],
    suggestSongs:[],
    suggestSongsNodes:[],
    searchValue:"",
    resultSongs:[]
  },
  onLoad(){
    //获取页面的数据
    this.getPageData()
  },
  //网络请求
  getPageData(){
    getSearchHot().then(res=>{
      // console.log(res);
      this.setData({hotKeywords:res.result.hots})
    })
  },
  //事件处理
  //输入框输入或者删除时执行函数
  handleSearchChange(event){
    //1.获取搜索框输入的关键字
    const searchValue=event.detail 
     //2.保存关键字
    this.setData({searchValue})
    //3.判断关键字为空字符串的处理逻辑
    if(!searchValue.length){ 
      this.setData({suggestSongs:[]}) 
      this.setData({resultSongs:[]})
      //第二种解决防抖带来的问题-->自己封装的防抖函数有取消事件的功能 
      debounceGetSearchSuggest.cancel()
      return
    }
    //4.根据关键字进行搜索
     //通过输入的值作为参数 调用数据请求
    debounceGetSearchSuggest(searchValue).then(res=>{ 
      //解决防抖延迟函数带来的问题-->输入框没有值了,还在数据请求
      // if(!this.data.searchValue.length){
      //   return
      // }
       //1.获取搜索建议的关键字歌曲
      const suggestSongs=res.result.allMatch
      this.setData({suggestSongs:suggestSongs})
      if(!suggestSongs.length) return
      
        //2.转成nodes节点
        //过滤并且返回一个只有搜索建议的关键字的数组
        const suggestKeyWords=suggestSongs.map(item=>item.keyword)
        //创建一个搜索建议的空数组-->存放nodes
        const suggestSongsNodes=[]
        //拿到每一个关键字
        for(const keyword of suggestKeyWords){
          //获取到nodes节点
        const nodes=stringToNodes(keyword,searchValue)
        //放入到最终的nodes节点上2
          suggestSongsNodes.push(nodes)
        }
        this.setData({suggestSongsNodes})
    })
  },
  //输入框输入结束后,点击回车时执行函数
  handleSearchAction(){
    const searchValue=this.data.searchValue
    getSearchResult(searchValue).then(res=>{
      // console.log(res);
      this.setData({resultSongs:res.result.songs})
    })
  },
  //点击搜索建议/热门词的每一项内容-->执行该函数
  //点击热门词的每一项内容-->执行该函数
  handleKeywordItemClick(event){
    //1.获取关键字
      const keyword=event.currentTarget.dataset.keyword
     //2.将关键字设置到searchValue
     this.setData({searchValue:keyword})
     //3.发送网络请求
     this.handleSearchAction()
  }
})