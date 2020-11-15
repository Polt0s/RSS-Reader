const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './src'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}