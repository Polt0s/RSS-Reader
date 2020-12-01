const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // entry: {
  //   main: path.resolve(__dirname, 'src/index.js'),
  // },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: '[name].bundle.js',
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
    ],
  },
  devServer: {
    open: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}