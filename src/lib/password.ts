const CHARSETS = { uppercase:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lowercase:'abcdefghijklmnopqrstuvwxyz',digits:'0123456789',special:'!@#$%^&*()_+-=[]{}|;:,.<>?' }
export type CharsetKey = keyof typeof CHARSETS
export function generatePassword(length:number,options:Record<CharsetKey,boolean>) {
  const groups=(Object.keys(options) as CharsetKey[]).filter(key=>options[key]).map(key=>CHARSETS[key])
  if(!groups.length) return ''
  function randomIndex(size:number) {
    const bytes=new Uint32Array(1),limit=0x100000000-(0x100000000%size)
    do { crypto.getRandomValues(bytes) } while(bytes[0]>=limit)
    return bytes[0]%size
  }
  const pool=groups.join(''),chars=groups.map(group=>group[randomIndex(group.length)])
  while(chars.length<length) chars.push(pool[randomIndex(pool.length)])
  for(let i=chars.length-1;i>0;i--) {const j=randomIndex(i+1);[chars[i],chars[j]]=[chars[j],chars[i]]}
  return chars.join('')
}
