const webpack = require('webpack')
webpack({
  entry: "./example/index.js",
  mode: "none",
  module: {
    rules: [{
      test: /\.less$/,
      use: ["css-loader", "../class-simplify-css-loader", "less-loader"]
    }, {
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      use: ["../class-simplify-js-loader", {
        loader: "babel-loader",
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }],
            ['@babel/preset-react']
          ]
        }
      }]
    }]
  },
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
