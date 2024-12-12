const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/viz.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'viz.js',
    libraryTarget: 'commonjs2'
  },

  externals: {
    vscode: 'commonjs vscode'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'ladder-diagram': path.resolve(__dirname, 'node_modules/ladder-diagram/js/ladder.js'),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  mode: 'development',
  devtool: 'source-map'
};
