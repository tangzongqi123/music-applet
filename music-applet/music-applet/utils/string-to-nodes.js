export default function (keyword,value){
  const nodes=[]
  //判断-->搜索建议的值是否是以输入的值开头 startsWith会返回一个布尔值
  if(keyword.toUpperCase().startsWith(value.toUpperCase())){
    //key1的值为输入的值
    const key1=keyword.slice(0,value.length)
    //设置元素节点
    const node1={
      name:"span",
      attrs:{style:"color:#26ce8a;"},
      //设置子节点text:key1
      children:[{type:"text",text:key1}]
    }
    //将设置好的节点放入到nodes中
    nodes.push(node1)
    //后面的文本一律为黑色-->和输入的值做区分
    const key2=keyword.slice(value.length)
    const node2={
      name:"span",
      attrs:{style:"color:black"},
      children:[{type:"text",text:key2}]
    }
    nodes.push(node2)
  }else{
    const node={
      name:"span",
      attrs:{style:"color:black"},
      children:[{type:"text",text:keyword}]
    }
    nodes.push(node)
  }
  return nodes
}