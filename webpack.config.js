const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const js = {
  test: /\.(jsx?)$/,
  use: ['babel-loader'],
  exclude: /.+\/node_modules\/.+/,
};

const css = {
  test: /\.(css)$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[name]-[local]-[hash:4]',
          exportLocalsConvention: 'camelCase',
        },
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        ident: 'postcss',
        plugins: () => [postcssPresetEnv({ stage: 0 })],
      },
    },
  ],
};

// Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
const files = {
  test: /\.(png|jpg|gif|webp|svg|zip)$/,
  loader: [{ loader: 'url-loader' }],
};

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/ui.js', // The entry point for your UI code
    code: './src/code.js', // The entry point for your plugin code
  },

  module: {
    rules: [js, css, files],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
});
