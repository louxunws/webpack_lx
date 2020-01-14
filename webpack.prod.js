'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')                         // css文件指纹
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')    // css文件压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')                                // html文件压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin')                          // 清除构建目录  
/* css内联 html-inline-css-webpack-plugin 和 mini-css-extract-plugin配合使用, 
 mini-css-extract-plugin将css提取成css文件, html-inline-css-webpack-plugin将这个文件内联进header标签内 */
const HTMLInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default
const glob = require('glob')                                                            // 动态获取entry 进行多页面打包
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


function setMAPS() {
    console.log('99')
    const entry = {}
    const HtmlWebpackPlugins = []
    const pageFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    Object.keys(pageFiles)
        .map((index) => {
            const fileUrl = pageFiles[index]
            
            const match = fileUrl.match(/src\/(.*)\/index\.js/);   // 正则匹配出文件名
            const pageName = match && match[1]
            entry[pageName] = fileUrl
            HtmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),          // html 模板位置
                    filename: `${pageName}.html`,                                          // 指定打包出来的html文件名称true
                    chunks: [pageName],                                                    // 指定生成出来的html需要哪些chunk
                    inject: true,                                                          // 为true时会将打包出来的chunk注入到html文件中
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,                                                   // 是否压缩内联的js和css
                        minifyJS: true,
                        removeComments: false
                    }
                })
            )
        })

    return {
        entry,
        HtmlWebpackPlugins
    }
}

const { entry, HtmlWebpackPlugins } = setMAPS()

module.exports = {
    entry: entry,
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
                    MiniCssExtractPlugin.loader,                                // 会将css提取成一个文件
                    "css-loader",
                    "less-loader",
                    {
                        loader: 'postcss-loader',                               // autoprefixer添加前缀需要配合postcss-loader使用
                        options: {
                            plugins: ()=> [
                                require('autoprefixer')({                       // 自动添加c3前缀
                                    overrideBrowserslis: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',                                // 将px自动转rem
                        options: {
                            remUnit: 75,                                        // 1rem = 75px  转换比例
                            remPrecision: 8                                     // 转化后小数点保留位数
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
    plugins: HtmlWebpackPlugins.concat(
        [
            new MiniCssExtractPlugin({
                filename: '[name]_[contenthash].css'
            }),
            new OptimizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano')                                    // 预处理器
            }),
            new CleanWebpackPlugin(),
            /* HTMLInlineCssWebpackPlugin 需要放在 HtmlWebpackPlugin 后面 */
            new HTMLInlineCssWebpackPlugin(),
            new HtmlWebpackExternalsPlugin({
                externals: [
                    {
                      module: 'react',
                      entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                      global: 'React',
                    }
                ] 
            })
        ]
    ),
    devtool: 'source-map'
}