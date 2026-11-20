import { test } from 'node:test'
import assert from 'node:assert/strict'
import { convertBase,mortgagePayment,textToBinary,binaryToText,randomIntegers,diffLines } from './toolMath'
import { generatePassword } from './password'

test('进制转换保留超出安全整数的精度和负数',()=>{
  const large='123456789012345678901234567890'
  const hex=convertBase(large,10)[16]
  assert.equal(convertBase(hex,16)[10],large)
  assert.equal(convertBase('-FF',16)[2],'-11111111')
  assert.equal(convertBase('0',2)[10],'0')
})
test('进制转换拒绝部分有效或进制外的字符',()=>{
  for(const [value,base] of [['102',2],['7x',8],['12.2',10],['0xFF',16],['',10]] as const) assert.throws(()=>convertBase(value,base))
})
test('房贷支持零利率和正常还款',()=>{
  assert.deepEqual(mortgagePayment(120000,0,10),{monthly:1000,totalPayment:120000,totalInterest:0})
  assert.ok(Math.abs(mortgagePayment(1000000,4.2,30).monthly-4890.17)<.01)
  for(const args of [[0,4,30],[1,-1,30],[1,4,0],[1,4,101],[NaN,4,30]])assert.throws(()=>mortgagePayment(...args as [number,number,number]))
})
test('UTF-8 二进制正确往返中英文和表情',()=>{
  for(const value of ['','Hello','你好 👨‍👩‍👧‍👦 café\n'])assert.equal(binaryToText(textToBinary(value)),value)
  assert.throws(()=>binaryToText('101'))
  assert.throws(()=>binaryToText('11111111'))
})
test('随机抽样在巨大范围内保持数量、唯一性和边界',()=>{
  const values=randomIntegers(-1000000000,1000000000,10000,false)
  assert.equal(values.length,10000);assert.equal(new Set(values).size,10000)
  assert.ok(values.every(v=>Number.isInteger(v)&&v>=-1000000000&&v<=1000000000))
  assert.deepEqual(randomIntegers(7,7,3,true),[7,7,7])
  assert.deepEqual(randomIntegers(-2,2,5,false).sort((a,b)=>a-b),[-2,-1,0,1,2])
  for(const args of [[2,1,1,false],[0,2,4,false],[0,10,10001,true],[.1,2,1,true]])assert.throws(()=>randomIntegers(...args as [number,number,number,boolean]))
})
test('逐行差异可重建原文和新文本，保留空行',()=>{
  for(const [before,after] of [['a\nb\nc','a\nx\nc'],['','hello'],['a\n\nb\n','a\nb\n'],['相同','相同']]){
    const diff=diffLines(before,after)
    assert.equal(diff.filter(v=>v.type!=='add').map(v=>v.text).join('\n'),before)
    assert.equal(diff.filter(v=>v.type!=='remove').map(v=>v.text).join('\n'),after)
  }
  assert.throws(()=>diffLines('\n'.repeat(1001),''))
})
test('密码包含每个选中的字符组且长度准确',()=>{
  for(let i=0;i<100;i++){
    const value=generatePassword(24,{uppercase:true,lowercase:true,digits:true,special:true})
    assert.equal(value.length,24);assert.match(value,/[A-Z]/);assert.match(value,/[a-z]/);assert.match(value,/\d/);assert.match(value,/[^A-Za-z0-9]/)
  }
  assert.match(generatePassword(12,{uppercase:false,lowercase:false,digits:true,special:false}),/^\d{12}$/)
  assert.equal(generatePassword(12,{uppercase:false,lowercase:false,digits:false,special:false}),'')
})

test('工具目录的 ID、分类和懒加载入口完整一致',async()=>{
  const {tools,categories}=await import('../data/tools')
  const {readFile}=await import('node:fs/promises')
  const page=await readFile(new URL('../pages/ToolPage.tsx',import.meta.url),'utf8')
  const ids=tools.map(tool=>tool.id)
  assert.equal(ids.length,88);assert.equal(new Set(ids).size,88)
  for(const tool of tools){assert.ok(categories.some(category=>category.id===tool.category));assert.ok(page.includes(`'${tool.id}': lazy(`),tool.id)}
})
