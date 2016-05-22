const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const DotenvPlugin = require('webpack-dotenv-plugin')

const TARGET = process.env.npm_lifecyle_event
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist')
}

const common = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js|\.jsx$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.s(a|c)ss$/,
      loader: "style!css!sass"
    },
    {
      test: /\.css$/,
      loaders: "style!css"
    }, 
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  }
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new DotenvPlugin({ sample: './.env.example' }),
      new webpack.HotModuleReplacementPlugin()
    ],
  })
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    plugins: [
      new DotenvPlugin({ sample: './.env.example' }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ]
  })
}