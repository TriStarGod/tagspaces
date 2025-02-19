/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'web',

  entry: ['babel-polyfill', './app/index'],

  output: {
    libraryTarget: 'window', // 'commonjs2',
    path: path.join(__dirname, 'web/dist'),
    publicPath: './dist/'
  },

  optimization: {
    // We no not want to minimize our code. TODO remove this for production
    minimize: true
  },

  node: {
    fs: 'empty',
    child_process: 'empty'
  },

  module: {
    rules: [
      // Extract all .global.css to style.css as is
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // Pipe other styles through css modules and append to style.css
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              sourceMap: true
            }
          }
        ]
      },
      // Add SASS support  - compile all .global.scss files and pipe it to style.css
      {
        test: /\.global\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // Add SASS support  - compile all other .scss files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            // name: '[name].[ext]',
            publicPath: '../dist/',
          }
        }]
      },
      // Text files
      {
        test: /\.(txt)$/,
        use: 'raw-loader'
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
        use: 'url-loader',
      }
    ]
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({ // evtl make process.env.NODE_ENV false for cordova and web
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),

    new webpack.IgnorePlugin(/electron-io/),

    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),

  ],
});
