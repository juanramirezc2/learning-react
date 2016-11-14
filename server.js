/*var express = require('express'),
app = express();

app.use(express.static('public'))
app.listen(3000,(e)=>{
  if(e){
    console.error(e)
  }
  else{
    console.log('listenning on port 3000',e)
  }
}) */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3002, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
