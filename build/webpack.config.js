const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  /**
   * mode: 模式
   * 1. development: 开发模式
   * 2. production: 生产模式
   * 3. package.json script 可以设置 --mode=development 打包或启动命令
   * 4. 更多可查阅 https: //webpack.js.org/configuration/mode/#root
   */
  mode: 'development',
  /**
   * devServer: 开发服务器 https: //webpack.docschina.org/configuration/dev-server/
   * 1. contentBase: 访问打包好的文件夹
   * 2. host
   * 3. port: 端口
   * 4. hot: 是否热加载（ webpack5 内置了热加载） https: //webpack.docschina.org/plugins/hot-module-replacement-plugin/#root
   * 5. open: 是否打开浏览器
   */
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 9000,
    hot: true
  },
  /**
   * entry: webpack 开始构建包的入口
   * 1. 更多可查阅 https: //webpack.js.org/configuration/entry-context/#entry
   */
  entry: path.resolve(__dirname, '../src/index.js'),
  /**
   * 为了更容易地追踪错误和警告， JavaScript 提供了 source map 功能， 将编译后的代码映射回原始源代码。
   * https: //www.webpackjs.com/guides/development/
   */
  devtool: 'inline-source-map',
  /**
   * output: 打包输出配置
   * 1. 更多可查阅 https: //webpack.js.org/configuration/output/
   */
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: 'images/[name].[hash:8].[ext]'
  },
  /**
   * module
   */
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  /**
   * plugins
   */
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
}
