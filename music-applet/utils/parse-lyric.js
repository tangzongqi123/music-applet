//正则表达式:字符串匹配的利器
//[00:06.20]   转义 \[ -->[   \d{2}-->任意数字,匹配2个    {2,3} 2-3个
const timeRegExp=/\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString){
  const lyricStrings=lyricString.split("\n")
  const lyricInfos=[]
  for(const lineString of lyricStrings){
    //[00:06.20]曲：APEX (LEGGO & Kyra Z & 4D) 每一行
    // console.log(lineString);
    const timeResult=timeRegExp.exec(lineString)
    // console.log(timeResult);
    if(!timeResult) continue
    //1.获取时间
    const minute=timeResult[1]*60*1000  //分钟
    const second=timeResult[2]*1000  //秒
    const millsecondTime=timeResult[3]
    const millsecond=millsecondTime.length === 2 ? millsecondTime*10:millsecondTime*1  //毫秒
    const time=minute+second+millsecond
    // console.log(time);

    //2.获取歌词文本
    //[00:00.000] 作词 : APEX (LEGGO & Kyra Z & 4D) 将前面的替换成空的字符串
    const text=lineString.replace(timeRegExp,"")
    lyricInfos.push({time,text})
    // console.log(lyricInfos);
  }
  return lyricInfos
}