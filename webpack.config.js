var path = require("path");

module.exports = {
  entry: ["./js/index"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["react-hot-loader", "babel-loader"],
        include: [
          path.join(__dirname, "js"),
          path.join(__dirname, "node_modules/react-redux-provide")
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
    inline: true
  }
};
