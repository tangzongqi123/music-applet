const BASE_URL="https://coderwhy-music.vercel.app/"

class TRequest{
 request(url,method,params) {
    return new Promise((reslove,reject)=>{
      wx.request({
        url: BASE_URL+url,
        data: params,
        method: method,
        success: (res) => {reslove(res.data)},//拿到数据中的data,有2个data,外面就可以少做一层
        fail: reject,
      })
    })
  } 
 get(url,params){
   return this.request(url,"GET",params)
 }
 post(url,data){
   return this.request(url,"POST",data)
 }
}
const tRequest=new TRequest()
export default tRequest