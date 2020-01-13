'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')                                // html文件压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin')                          // 清除构建目录 

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules:[
            {
                test: /\.js|jsx$/,
                use: "babel-loader"
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,                        // 1rem = 75px  转换比例
                            remPrecision: 8                     // 转化后小数点保留位数
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({                                 // dev 环境使用这个plugin 再第一次启动webpack时可以生成一个html文件
            template: path.join(__dirname, 'src/index.html'),   // html 模板位置
            filename: 'index.html',    // 指定打包出来的html文件名称
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
        })
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
}