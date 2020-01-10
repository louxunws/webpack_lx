'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')                         // css文件指纹
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')    // css文件压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')                                // html文件压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin')                          // 清除构建目录    

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules:[
            {
                test: /\.js|jsx$/,
                use: "babel-loader"
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,  // style-loader最终会将样式插入到header中不会生成css文件, 要使用这个loader
                    "css-loader",
                    "less-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: ()=> [
                                require('autoprefixer')({
                                    overrideBrowserslis: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')    // 预处理器
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),   // html 模板位置
            filename: 'index.html',    // 指定打包出来的html文件名称true
            chunks: ['main'],          // 指定生成出来的html需要哪些chunk
            inject: true,              // 为true时会将打包出来的chunk注入到html文件中
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,       // 是否压缩内联的js和css
                minifyJS: true,
                removeComments: false
            }
        }),
        new CleanWebpackPlugin()
    ]
}