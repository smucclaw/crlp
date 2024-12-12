const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/viz.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'viz.js',
    library: 'LadderDiagram',
    libraryTarget: 'umd',
    globalObject: 'this'
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
  plugins: [
    new webpack.ProvidePlugin({
      LadderDiagram: ['ladder-diagram', 'LadderDiagram'],
      BoolVar: ['ladder-diagram', 'BoolVar'],
      AllQuantifier: ['ladder-diagram', 'AllQuantifier'],
      AnyQuantifier: ['ladder-diagram', 'AnyQuantifier'],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        //exclude: /node_modules/,
        exclude: /node_modules\/(?!(ladder-diagram)\/).*/,
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
