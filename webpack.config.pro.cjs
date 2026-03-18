const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/example/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'distweb'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    clean: true,
    publicPath: './',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@example': path.resolve(__dirname, 'src/example'),
    },
  },
  externals: {
    // Remove React from externals to ensure it's bundled
  },
  externalsType: 'window',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules\/(?!(@dnd-kit))/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.dev.json'),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].chunk.css',
      ignoreOrder: false,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // React 核心库单独打包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-core',
          priority: 40,
          enforce: true,
        },
        // 其他 React 相关库
        reactVendor: {
          test: /[\\/]node_modules[\\/](react-|@types\/react)[\\/]/,
          name: 'react-vendor',
          priority: 35,
        },
        // UI 组件库
        uiVendor: {
          test: /[\\/]node_modules[\\/](styled-components|classnames)[\\/]/,
          name: 'ui-vendor',
          priority: 30,
        },
        // 工具库
        utils: {
          test: /[\\/]node_modules[\\/](lodash|moment|dayjs|date-fns)[\\/]/,
          name: 'utils-vendor',
          priority: 25,
        },
        // 其他 node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
          reuseExistingChunk: true,
        },
        // 公共代码提取
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
      },
    },
    runtimeChunk: 'single',
    // 启用模块合并优化
    mergeDuplicateChunks: true,
    // 移除未使用的导出
    usedExports: true,
    // 作用域提升
    providedExports: true,
    // 副作用优化
    sideEffects: false,
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 500000,
    maxAssetSize: 500000,
  },
};
