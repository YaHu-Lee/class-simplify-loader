/**
 * 简化版 布隆过滤器 (bloom filter)
 * 构造函数 BloomFilter 可以指定过滤器使用的 hash 侦测序列长度
 * set 函数用来给过滤器指定一个推送值
 * no 函数用以判断指定的字符串是否真的不在过滤器的侦听序列中
 */

function BloomFilter(hashArrayLength = 20) {
  this.hashArray = new Array(hashArrayLength).fill(false)
  this.hashArrayLength = hashArrayLength
}
BloomFilter.prototype.set = function(selector) {
  const hashNumber_1 = this.hashFunction_1(selector)
  const hashNumber_2 = this.hashFunction_2(selector)
  this.hashArray[hashNumber_1] = true
  this.hashArray[hashNumber_2] = true
}
BloomFilter.prototype.no = function(selector) {
  const hashNumber_1 = this.hashFunction_1(selector)
  const hashNumber_2 = this.hashFunction_2(selector)
  return !(this.hashArray[hashNumber_1] && this.hashArray[hashNumber_2])
}
BloomFilter.prototype.hashFunction_1 = function(selector) {
  let hashNumber = 1
  selector.split('').map(char => hashNumber *= char.charCodeAt())
  return hashNumber % this.hashArrayLength
}
BloomFilter.prototype.hashFunction_2 = function(selector) {
  let hashNumber = 1
  selector.split('').map(char => hashNumber += char.charCodeAt())
  return hashNumber % this.hashArrayLength
}
module.exports = BloomFilter