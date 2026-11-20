/// <reference lib="webworker" />
self.onmessage = (event: MessageEvent<{ pattern:string;flags:string;text:string }>) => {
  try {
    const {pattern,flags,text}=event.data
    const regex=new RegExp(pattern,flags)
    const matches: {value:string;index:number;groups:string[]}[]=[]
    let match: RegExpExecArray|null
    while ((match=regex.exec(text)) !== null && matches.length<1000) {
      matches.push({value:match[0],index:match.index,groups:match.slice(1)})
      if (!regex.global && !regex.sticky) break
      if (match[0]==='') {
        const point=text.codePointAt(regex.lastIndex)
        regex.lastIndex += regex.unicode && point !== undefined && point>0xffff ? 2 : 1
      }
    }
    self.postMessage({matches,error:''})
  } catch(error) { self.postMessage({matches:[],error:(error as Error).message}) }
}
