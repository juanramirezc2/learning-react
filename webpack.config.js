var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval-source-map",
  entry: [
    "./js/index"
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/static/"
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ],
  module: {
    rules : [
      { 
        test:/\.js$/, 
        use: [ "react-hot-loader", "babel-loader" ],
        include: [ path.join(__dirname, "js"),path.join(__dirname,"node_modules/react-redux-provide")] },
      {
        test: /\.css$/,
        use: [ "style-loader",
               { loader: "css-loader",
                 options: {
                  modules: true,
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              "postcss-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000
}
};
