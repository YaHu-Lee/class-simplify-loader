const babel = require("@babel/core")
const generator = require("@babel/generator").default
const utils = require("util")

module.exports = function loader(source) {
  console.log(source)
  const result = babel.parseSync(source, {
    plugins: ["@babel/plugin-syntax-jsx"],
  })
  const dom = {
    root: {
      parent: null,
      children: [],
      classList: [],
      styleSheetNumber: 0,
      matchedStyleNumber: 0
      // 此处需解释
      // 在 webpack 中，module 加载顺序是按照类型编排的
      // 先加载完所有的 js 文件，在回头去加载每个 js 对应的 css 引用
      // 因此需要记录每个 js 文件 引用了几个 css
      // 当控制权转移到 css loader 时，像填坑一样把这些坑填上
    },
    currentNode: null,
    isCurrentSelfComplete: false,
    setCurrentSelfComplete() {
      this.isCurrentSelfComplete = true
    },
    setCurrentNormal() {
      this.isCurrentSelfComplete = false
    },
    handleOpening(classList) {
      if(!this.currentNode)this.currentNode = this.root
      const selfDescribe = {
        parent: this.currentNode,
        children: [],
        classList,
        id: Math.random() * 1000
      }
      this.currentNode.children.push(selfDescribe)
      if(!this.isCurrentSelfComplete)this.currentNode = selfDescribe
    },
    handleClosing() {
      this.currentNode = this.currentNode.parent
    }
  }
  // babel 在对 JSX 的 AST 进行 traverse 操作时，遵循的 visitor 顺序是：
  // Element -> Opening -> Element -> Opening -> Closing -> Closing
  // <Element>
  //   <Element>  
  //   </Element>  
  // </Element>
  // 如果是自闭合标签，则只有 Opening 没有 Closing
  // Element -> Opening -> Element -> Opening
  // <Element/>
  // <Element/>
  // 通过这三个 visiter 相互配合，可以建立一个正确的树结构，这中间已经包含可能出现的条件判断语句

  babel.traverse(result, {
    JSXOpeningElement(path) {
      const node = path.node
      const classList = node.attributes?.filter((attr) => attr.name.name === 'className')[0]?.value.value
      dom.handleOpening(classList)
    },
    JSXClosingElement(path) {
      dom.handleClosing()
    },
    JSXElement(path) {
      // todo: 添加对 自定义组件 的跳过处理
      if(!path.node.closingElement) { // 要处理的是自封闭节点
        dom.setCurrentSelfComplete()
      } else {                        // 要处理的是正常节点
        dom.setCurrentNormal()
      }
    },
    ImportDeclaration(path) {
      const node = path.node
      let importFileName = node.source.value
      if(/\.(less|css|scss|sass)$/.test(importFileName)) {
        node.source.value = importFileName += `?${Math.random() * 1000}`
        dom.root.styleSheetNumber++
      }
    }
  })

  global.domTreeArray = global.domTreeArray || []
  global.domTreeArray.push(dom.root)
  return generator(result).code
}
