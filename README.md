# class-simplify-loader

**一套**可以对`react`项目中的样式表针对浏览器查询过程进行优化的`Webpack Loader`。其具有以下优势：

* 针对CSS的Tree Shaking
* 让浏览器更快地渲染
* 对样式冲突说拜拜

为了实现这一目的，需要使用两个`loader`分别用以处理`css`文件和`jsx`文件，要体验这套插件提供的功能，必须**同时安装并使用以下两个插件**

## class-simplify-jsx-loader
此`loader`接收一段`jsx`代码
此`loader`的作用是，提取出该`jsx`中的`DOM`描述，解析出一个树形结构，将此树形结构推入全局数组中，供`class-simplify-css-loader`使用，同时，记录每个`DOM`节点的`className`，并为每个`DOM`节点生成唯一`id`。

### 使用方法
```js
module: {
  rules: [{
    test: /\.jsx$/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            ['@babel/preset-react']
          ]
        }
      }, "class-simplify-js-loader"]
  }]
}
```
⚠注意此`loader`的位置！此`loader`的输入输出均为`JSX`，因此在`loader`链中位于最后。


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
⚠注意此`loader`的位置！此`loader`的输入输出均为`css`，因此在`loader`链中处于`css-loader`(接收`css`字符串，产出`js`)之前，而位于`less-loader`(接收`less`字符串，产出`css`字符串)之后。