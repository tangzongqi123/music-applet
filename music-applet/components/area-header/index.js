// components/area-header/index.js
Component({
properties:{
  title:{
    type:String,
    value:"默认标题"
  },
  rightText:{
    type:String,
    value:"更多"
  },
  showRight:{
    type:Boolean,
    value:true
  },
},
methods:{
  handleRightClick(){
    this.triggerEvent("click")
  }
}

})