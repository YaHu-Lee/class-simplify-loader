# class-simplify-loader
一套可以对项目中的样式表针对浏览器查询过程进行优化的`Webpack Loader`
为了实现这一目的，本项目提供两个`loader`分别用以处理`css`文件和`js`文件，要体验这套插件提供的功能，必须**同时安装并使用以下两个插件**
## class-simplify-js-loader
此`loader`接收一段原生`js`(即，在`loader`链中应当位于`babel-loader`或其他类似`loader`之后)
此`loader`的作用是，提取出该`js`中的`DOM`描述，解析出一个树形结构，将此树形结构挂载于全局对象上，供`class-simplify-css-loader`使用，同时，为每个`DOM`节点生成唯一`id`，记录在该树形结构上。
## class-simplify-css-loader
在`css`文件解析阶段，拿到`class-simplify-js-loader`产生的`DOM`树对象，模拟css匹配查询过程，将`css`文件重构为以`id`选择器为组织。对这一查询过程的具体模拟请参看[这里](https://github.com/YaHu-Lee/CSS-simplify)。
### 使用方法
假设你在项目中用到`less`，使用此`loader`需要如下配置：
```js
module: {
  rules: [{
    test: /\.less$/,
    use: ["css-loader", "class-simplify-css-loader", "less-loader"]
  }]
}
```
⚠注意此`loader`的位置！此`loader`期望接收到原生`css`字符串，因此在`loader`链中处于`css-loader`(接收`css`字符串，产出`js`)之前，而位于`less-loader`(接收`less`字符串，产出`css`字符串)之后。