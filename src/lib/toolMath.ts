export function convertBase(value:string,from:number):Record<number,string> {
  const source=value.trim()
  const patterns:Record<number,RegExp>={2:/^-?[01]+$/,8:/^-?[0-7]+$/,10:/^-?\d+$/,16:/^-?[\da-f]+$/i}
  if(!patterns[from]?.test(source)) throw new Error('输入包含当前进制不支持的字符')
  const negative=source.startsWith('-')
  const unsigned=negative ? source.slice(1) : source
  const prefix:Record<number,string>={2:'0b',8:'0o',10:'',16:'0x'}
  const number=BigInt(prefix[from]+unsigned)*(negative ? -1n : 1n)
  return Object.fromEntries([2,8,10,16].map(base=>[base,number.toString(base).toUpperCase()]))
}
export function mortgagePayment(principal:number,annualRate:number,years:number) {
  if(!Number.isFinite(principal)||!Number.isFinite(annualRate)||!Number.isFinite(years)||principal<=0||annualRate<0||years<=0||years>100) throw new Error('请输入有效的金额、0 或正利率和 1–100 年期限')
  const months=Math.round(years*12)
  if(!months) throw new Error('贷款期限至少为 1 个月')
  const rate=annualRate/1200
  const monthly=rate===0 ? principal/months : principal*rate/(1-Math.pow(1+rate,-months))
  const totalPayment=monthly*months
  return {monthly,totalPayment,totalInterest:Math.max(0,totalPayment-principal)}
}
export function textToBinary(text:string) {
  return Array.from(new TextEncoder().encode(text),byte=>byte.toString(2).padStart(8,'0')).join(' ')
}
export function binaryToText(binary:string) {
  if(!binary.trim()) return ''
  const parts=binary.trim().split(/\s+/)
  if(parts.some(part=>!/^[01]{8}$/.test(part))) throw new Error('请输入以空格分隔的 8 位二进制字节')
  return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(parts,part=>parseInt(part,2)))
}
export function randomIntegers(min:number,max:number,count:number,duplicates:boolean) {
  const range=max-min+1
  if(![min,max,count].every(Number.isSafeInteger)||!Number.isSafeInteger(range)||range<=0||count<1||count>10000) throw new Error('请输入安全整数范围，生成数量为 1–10000')
  if(!duplicates && count>range) throw new Error(`不重复时最多生成 ${range} 个数字`)
  if(duplicates) return Array.from({length:count},()=>min+Math.floor(Math.random()*range))
  // Floyd's algorithm samples without allocating the entire requested range.
  const selected=new Set<number>()
  for(let index=range-count;index<range;index++) {
    const candidate=Math.floor(Math.random()*(index+1))
    selected.add(selected.has(candidate) ? index : candidate)
  }
  const result=Array.from(selected,value=>value+min)
  for(let index=result.length-1;index>0;index--){ const other=Math.floor(Math.random()*(index+1));[result[index],result[other]]=[result[other],result[index]] }
  return result
}
export type DiffLine={type:'same'|'add'|'remove';text:string}
export function diffLines(before:string,after:string):DiffLine[] {
  const a=before.split('\n'),b=after.split('\n')
  if(a.length>1000||b.length>1000) throw new Error('每侧最多对比 1000 行')
  const widths=b.length+1
  const table=new Uint16Array((a.length+1)*widths)
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--) table[i*widths+j]=a[i]===b[j] ? table[(i+1)*widths+j+1]+1 : Math.max(table[(i+1)*widths+j],table[i*widths+j+1])
  const result:DiffLine[]=[]
  let i=0,j=0
  while(i<a.length||j<b.length) {
    if(i<a.length && j<b.length && a[i]===b[j]) {result.push({type:'same',text:a[i++]});j++}
    else if(j<b.length && (i===a.length || table[i*widths+j+1]>table[(i+1)*widths+j])) result.push({type:'add',text:b[j++]})
    else result.push({type:'remove',text:a[i++]})
  }
  return result
}
