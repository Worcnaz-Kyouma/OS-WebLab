const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  entry: {
    popup: './src/popup/popup.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/popup/popup.css', to: 'popup.css' },
        { from: 'src/popup/style.css', to: 'style.css' },
        { from: 'src/popup/numSysConverter', to: 'numSysConverter' },
        { from: 'src/popup/numSysCalculator', to: 'numSysCalculator' },
        { from: 'src/popup/popup.html', to: 'popup.html' }
      ]
    }),
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['node build.js'],
        blocking: true,
        parallel: false
      }
    })
  ],
  mode: 'development',
  devtool: 'source-map'
};