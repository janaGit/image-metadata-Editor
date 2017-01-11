var express = require("express");
var path = require('path');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");

var app = express();
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));

});

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});

