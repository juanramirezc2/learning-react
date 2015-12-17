// module.exports = {
//  	resolve: {
//  		extensions: ['', '.jsx', '.js'] },
//  		entry : './src/js/app.jsx',
//  		output: {
//  			path : './build',
//  			filename : 'index.js'
//  		},
//  		module: {
// 			loaders : [{
// 				test: /\.jsx$/,
//         exclude: /node_modules/,
// 				loader: 'babel-loader'
// 			}]
// 		}
// }

var path    = require('path'),
    webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: './',
    filename: 'index.js'
  },
  devServer: {
    inline: true,
    port: 3333
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test:/\.js$/,
        loaders: ['react-hot','babel'],
        include : path.join(__dirname,'src') 
      }
    ]
  }
}
