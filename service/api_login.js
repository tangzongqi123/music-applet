// import {tLoginRequest} from "./index"
// export function getLoginCode(){
//   return new Promise((resolve,reject)=>{
//     wx.login({
//       timeout: 1000,
//       success:res=>{
//         // console.log(res.code);
//         const code =res.code
//         resolve(code)
//       },
//       fail:err=>{
//         // console.log(res.code);
//         reject(err)
//       }
//     })
//   })
// }

// export function codeToToken(code){
//   return tLoginRequest.post("/login",{code})
// }

// export function checkToken(){
//   return tLoginRequest.post("/auth",{},true)
// }

// export function checkSession(){
//   return new Promise((resolve)=>{
//     wx.checkSession({
//       success: () => {
//         resolve(true)
//       },
//       fail:()=>{
//         resolve(false)
//       }
//     })
//   })
// }