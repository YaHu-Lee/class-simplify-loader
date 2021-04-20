const webpack = require('webpack')
webpack({
  entry: "./example/index.js",
  mode: "production",
  module: {
    rules: [{
      test: /\.less$/,
      use: ["css-loader", "../class-simplify-css-loader", "less-loader"]
    }, {
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            ['@babel/preset-react']
          ]
        }
      }, "../class-simplify-js-loader"]
    }]
  },
  cache: false
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
