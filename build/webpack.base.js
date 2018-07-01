'use strict';
var path = require('path');
var webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: "development",
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  entry: path.resolve('./src/main.ts'),
  output: {
    path: path.resolve('./dist'),
    publicPath: '/dist/',
    filename: 'build.js',
    chunkFilename: "[name].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src|tests/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            esModule: true
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        loader: 'less-loader'
      }
    ]
  },
  resolve: {
    extensions: [".vue", ".ts", ".js", ".json"]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tslint: true
    }),
  ],
  node: {
    fs: 'empty'
  }
};
