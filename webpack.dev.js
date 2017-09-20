const path = require('path');
const publicPath = 'http://localhost:7777/';
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './examples/index.jsx'
  },
  
  devtool: 'inline-source-map',

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    publicPath: publicPath,
    sourceMapFilename: 'bundle.map'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader', ],
        exclude: /node_modules/
      }
    ],
  },

  devServer: {
    hot: true,
    port: 7777,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: publicPath,
    contentBase: ['./examples', './src']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  }
};
