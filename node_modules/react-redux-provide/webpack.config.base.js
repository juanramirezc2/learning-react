'use strict';

var webpack = require('webpack');

module.exports = {
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'redux': {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux'
    },
    'redux-replicate': {
      root: 'ReduxReplicate',
      commonjs2: 'redux-replicate',
      commonjs: 'redux-replicate',
      amd: 'redux-replicate'
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReactReduxProvide',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
