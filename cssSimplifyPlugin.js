// 利用 webpack 中的全局对象来进行不同类型文件之间的数据交换
// 需要解决的事情是：在 loader 开始处理 css 文件之前，要能拿到 HTML(或者其他类似文件)的树结构
// 还需要处理模块间依赖的问题，不妨认为每个 css 文件只被唯一的页面文件引用
// 在解析 js 的时候，解析出它所引用的所有 css 文件，把这单个两层树形依赖关系存在 global 对象中
// {
//   css1: js1,
//   css2: js1,
//   css3: js1,
// }
// 给 js 中每个 Dom 描述符添加唯一 ID， 但不能抹除 class， 因为匹配 css 时要用到 class 列表
// 同时，想办法解析出此 js 将来要渲染的树形结构，
// {
//   js1: DomTree
// }
// loader 解析 css 时，针对此 DomTree 做优化
module.exports = class cssSimplifyPlugin {
  apply(complier) {
    complier.hooks.thisCompilation.tap("css-simplify", (compilation, compilationParams) => {
      global.compilation = compilation
      // 在buildModuke阶段，可以获取到的信息有：
      // compilation.hooks.buildModule.tap("css-simplify", (module) => {
      //   console.log(compilation.currentDomTree)
      //   modifyCompilation(compilation)
      //   console.log(module)
      // })
      // compilation.hooks.buildModule.tap("css-simplify", () => {

      // })
      // compilation.hooks.succeedModule.tap("css-simplify", () => {

      // })
    })
  }
}
function modifyCompilation(compilation) {
  compilation.currentDomTree = "this is a test"
}