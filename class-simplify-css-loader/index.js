const postcss = require("postcss")
const BloomFilter = require("./bloomFilter.js")
module.exports = function loader(source) {
    const m_idRules = {},
          m_classRules = {},
          m_tagRules = {},
          m_shadowPseudoElementRules = {},
          idBloomFilter = new BloomFilter(),
          classBloomFilter = new BloomFilter(),
          tagBloomFilter = new BloomFilter(),
          shadowPseudoElementBloomFilter = new BloomFilter()
    const DOM2CSS_Class = new Map()    // 内部维护每个DOM与其对应的CSS规则对象

  if(!global.domTreeArray) {
    console.log("未注册全局domTree对象，可能是由于没有使用 class-simplify-js-loader")
  }
  findDomTree()
  const result = renderCSS()
  console.log("优化结果")
  console.log(result)
  return result
  function findDomTree() {
    const domTreeArray = global.domTreeArray
    if(!domTreeArray){
      // 警示处理
    } else {
      for(let index = 0; index < domTreeArray.length; index++) {
        if(domTreeArray[index].matchedStyleNumber < domTreeArray[index].styleSheetNumber) {
          // 这个domTree的样式表还没找全
          // 这意味着 当前的 source 就是这个domTree的样式其中之一
          domTreeArray[index].matchedStyleNumber++
          simplifyCSS(domTreeArray[index].children[0])
          break
        }
      }
    }
  }
  function simplifyCSS(root) {
    if(!root) return
    const tagReg = /div|p|span|img|br|a/g                                         // 写代码的时候瞎诹的
    let cssTree
    try {
      cssTree = postcss.parse(source)
    } catch (error) {
      console.error(error)
    }
    // 提取 css 文件中所有的选择器存放在各自的 map 中
    cssTree.walkRules(rule => {
      const selectors = rule.selector.split(',') || []
      selectors.forEach(selector => {
        const selectorPhrase = selector.trim().split(' ')
        const searchPath = [...selectorPhrase].reverse()
        const currentSelector = selectorPhrase[selectorPhrase.length - 1].trim()  // 取到一串选择器的最后一项
        // 判断这一项属于哪一类
        if(currentSelector.indexOf('#') === 0) {                                  // id选择器
          if(!m_idRules[currentSelector]) {
            m_idRules[currentSelector] = []
          }
          m_idRules[currentSelector].push(Object.assign({}, rule, {selector, searchPath}))
          idBloomFilter.set(currentSelector)
        } else if(currentSelector.indexOf('.') === 0) {                           // 类选择器
          if(!m_classRules[currentSelector]) {
            m_classRules[currentSelector] = []
          }
          m_classRules[currentSelector].push(Object.assign({}, rule, {selector, searchPath}))
          console.log("向classHash中添加" + currentSelector)
          classBloomFilter.set(currentSelector)
        } else if(tagReg.test(currentSelector)) {                                    // 标签选择器
          if(!m_tagRules[currentSelector]) {
            m_tagRules[currentSelector] = []
          }
          m_tagRules[currentSelector].push(Object.assign({}, rule, {selector, searchPath}))
          tagBloomFilter.set(currentSelector)
        }
        // 当前缺少伪类选择器的处理逻辑！！！因为我还没想清楚伪类选择器与其他选择器的共存关系 T_T.
      })
    })
    

    // 遍历dom树结构来查询样式
    const nodeArray = []
    nodeArray.push(root)
    while(nodeArray.length) {
      const currentNode = nodeArray.pop()
      currentNode.children.forEach(child => nodeArray.push(child))
      searchCSSByClass(currentNode)         // 暂时先实现依照 class 匹配
    }
  }
  function searchCSSByClass(node) {
    const resultRules = []                       // 这里存放所有与当前 Node 节点相符合的所有 Rules
    const nodeClassList = node.classList?.trim().split(' ') || [] // 提取node的className
    nodeClassList.forEach(nodeClass => {
      if(nodeClass === "")return
      const className = '.' + nodeClass
      if(classBloomFilter.no(className)) {
        console.log(`在classHash中未找到 ${className}`)
        return
      } else {
        const matchedRules = m_classRules[className]
        if(!matchedRules || matchedRules.length === 0) return
        matchedRules.forEach(rule => {
          if(isMatched(node, rule)) {
            resultRules.push(rule)
          }
        })
      }
    })
    DOM2CSS_Class.set(node, resultRules)              // 将当前 DOM 节点与其所对应的 CSS Rules 关联起来
  }
  function isMatched(node, rule) {
    let currentNode = node
    // node: react node
    // rule: postcss rule
    // 处理流程： 
    // 首先提取 rule 中完整的选择器查询顺序，这个顺序已经被处理好放在 searchPath 属性中了
    // 然后，将 searchPath 规划为栈，沿 node 继承链向上查询，如果遇到匹配栈顶的 node 就出栈一个
    // 直到 node 向上走完，看看栈中是否还有元素
    const searchPath = [...rule.searchPath]
    currentNode = currentNode.parent
    searchPath.shift()
    while(currentNode && searchPath.length) {
      const currentClassList = currentNode.classList?.trim().split(' ') || []
      const currentSelector = searchPath[0].slice(1)         // 把 selector 刚开头的 . 切掉
      if(currentClassList.includes(currentSelector)) {
        searchPath.shift()
      }
      currentNode = currentNode.parent
    }
    if(!searchPath.length) {
      return true
    } else return false
  }
  function renderCSS(combine = false) {
    // 此函数为CSS出口函数，其作用是将每个DOM所对应的CSS映射到文件内
    // 为每个DOM创建专属id，其对应的类选择器被映射为专属id选择器
  
    // 参数 combine 作用：合并匹配到同一 DOM 的多个选择器
    let css = ''
    DOM2CSS_Class.forEach((rules, dom) => {
      // cssText: `#L1234{}`
      const Id = '#' + dom.id
      let domRule = ''
      rules.forEach(rule => {
        let currentRule = ''
        const declarations = rule.nodes
        declarations.forEach(declaration => {
          currentRule = currentRule + declaration.prop + ':' + declaration.value + ';'
        })
        if(!combine) domRule = domRule + Id + `{${currentRule}}`
        else domRule = domRule + currentRule
      })
      if(!combine) css = css + domRule
      else css = css + Id + `{${domRule}}`
    })
    return css
  }
  
}