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
  module: {
    loaders: [
      {
        test:/\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
