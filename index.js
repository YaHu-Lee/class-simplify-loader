const webpack = require('webpack')
const cssSimplifyPlugin = require("./cssSimplifyPlugin")
webpack({
  entry: "./test.js",
  mode: "none",
  module: {
    rules: [{
      test: /\.less$/,
      use: ["css-loader", "less-loader"]
    }]
  },
  plugins: [
    new cssSimplifyPlugin()
  ]
}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  // Log result...
});