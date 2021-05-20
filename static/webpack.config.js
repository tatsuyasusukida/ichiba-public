const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    polyfill: ['core-js/stable', 'regenerator-runtime/runtime', 'whatwg-fetch'],
    vue: './src/vue.js',
    app: './src/app.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {targets: "defaults"}],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  target: ['web', 'es5'],
  devtool: false,
  devServer: {
    inline: false,
    port: 8080,
    contentBase: path.join(__dirname, 'public'),
  },
}
