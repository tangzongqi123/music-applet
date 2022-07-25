export default function(selector){
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res)=>{
    // console.log(res[0]);
    resolve(res)
    })
  })

}