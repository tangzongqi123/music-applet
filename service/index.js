// const BASE_URL="https://coderwhy-music.vercel.app/"
const BASE_URL="http://codercba.com:9002"


// import {TOKEN_KEY} from "../constans/token-const"
// const token=wx.getStorageSync(TOKEN_KEY)
// const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class TRequest{
  constructor(baseURL,authHeader={}){
    this.baseURL=baseURL
    this.authHeader=authHeader
  }
 request(url,method,params,isAuth=false,header={}) {
   const finalHeader=isAuth ? {...this.authHeader,...header} :header
    return new Promise((reslove,reject)=>{
      wx.request({
        url: this.baseURL+url,
        data: params,
        method: method,
        header:this.authHeader,
        success: (res) => {reslove(res.data)},//拿到数据中的data,有2个data,外面就可以少做一层
        fail: reject,
      })
    })
  } 
 get(url,params,isAuth=false,header){
   return this.request(url,"GET",params,isAuth,header)
 }
 post(url,data,isAuth=false,header){
   return this.request(url,"POST",data,isAuth,header)
 }
}
const tRequest=new TRequest(BASE_URL)

// const tLoginRequest=new TRequest(LOGIN_BASE_URL,{token})

export default tRequest
// export{
//   tLoginRequest
// }