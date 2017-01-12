var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    './app/vendor','./app/main'],
  output: {
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      { test: /\.css$/, loaders: ['to-string-loader','style-loader','css-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/, loader: 'file-loader'}
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(__dirname, './src'),
      {

      }
    ),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
}
