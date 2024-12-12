const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/viz.ts',

  output: {
    filename: 'viz.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'ladder-diagram': path.resolve(__dirname, 'node_modules/ladder-diagram/js/ladder.js'),
    },
  },

  externals: {
    vscode: 'commonjs vscode',
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
};
