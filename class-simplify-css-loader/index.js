const postcss = require("postcss")
module.exports = function loader(source) {
  if(!global.domTreeArray) {
    console.log("")
  }
  console.log("css loaded")
  console.log(source)
  console.log(global.domTreeArray[0].children)
  return source
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
        }
      }
    }
  }
  function simplifyCSS(root) {
    // root
  }
}