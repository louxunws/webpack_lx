'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')                         // css文件指纹
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')    // css文件压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')                                // html文件压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin')                          // 清除构建目录  

/*
   css内联
   html-inline-css-webpack-plugin 和 mini-css-extract-plugin配合使用, 
   mini-css-extract-plugin将css提取成css文件, html-inline-css-webpack-plugin将这个文件内联进header标签内
*/
const HTMLInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default  


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
                    MiniCssExtractPlugin.loader,                      // 会将css提取成一个文件
                    "css-loader",
                    "less-loader",
                    {
                        loader: 'postcss-loader',                           // autoprefixer添加前缀需要配合postcss-loader使用
                        options: {
                            plugins: ()=> [
                                require('autoprefixer')({                   // 自动添加c3前缀
                                    overrideBrowserslis: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',                // 将px自动转rem
                        options: {
                            remUnit: 75,                        // 1rem = 75px  转换比例
                            remPrecision: 8                     // 转化后小数点保留位数
                        }
                    },
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
        new CleanWebpackPlugin(),
        /* HTMLInlineCssWebpackPlugin 需要放在 HtmlWebpackPlugin 后面 */
        new HTMLInlineCssWebpackPlugin()
    ]
}