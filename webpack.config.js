const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TeserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const {DefinePlugin} = require('webpack')



const isProduction = process.env.NODE_ENV=='production'

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
    mode: isProduction ? 'production': 'development',
    entry: './src/main.ts',
    output: {
        clean: true, 
        // 每次构建前清空目标目录
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].[contenthash:8].bundle.js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        assetModuleFilename: 'static/[name].[hash:8].[ext]' // 通用资源目录
    },
    module: {
        rules: [
            // 各种解析
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/i, 
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.styl$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'stylus-loader']
            },
            {
                test: /\.tsx?/i,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                        }
                    }
                ]
            },
            {
                test: /\.m?js$/i,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            // 图片
            {
                test: /\.(png|jpe?g|bmp|gif|webp|svg)$/i,
                type: 'asset',
                generator: {
                    filename: './static/image/[name][hash][ext][query]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                    }
                }
            },
            // 字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/font/[name][hash][ext]'
                }
            },
            // 视频
            {
                test: /.(mp4|mp3|webm)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/media/[name][ext]'
                }
            }
        ]
    },
    // 模块解析
    resolve: {
        // 别名
        alias: {
            '@': path.resolve(__dirname, 'src') 
        },
        // 如果是目录且没有package.json且main字段无，则读取设置的mainFiles
        mainFiles: ['index'],
        // 用于模块搜索的文件后缀
        extensions: ['.ts','.tsx','...']
    },
    externals: {
        // 外部扩展
        'vue': 'Vue',
        'vue-router': 'VueRouter'
    },
    plugins: [
        // 插件
        new HtmlWebpackPlugin({
            title: 'webpack5+vue示例',
            filename: 'index.html',
            template: './public/index.html',
            minify: isProduction ? { // 生产环境中使用
                // 移除注释
                removeComments: true,
                // 移除属性
                removeEmptyAttributes: true,
                // 移除默认属性
                removeRedundantAttributes: true,
                // 折叠空白字符
                collapseWhitespace: true,
                // 压缩内联的CSS
                minifyCSS: true,
                // 压缩javascript
                minifyJS: {
                    mangle: {
                        toplevel: true
                    }
                }
            } : false,
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[contenthash].css',
            chunkFilename: 'static/css/[contenthash]_chunk.css',
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(true)
        })
    ]
}

module.exports = () => {
    // 如果是生产环境
    if(isProduction) {
        config.optimization = {
            // 开启tree shaking， 生产环境默认开启
            usedExports: true, 
            // 合并模块，生产环境默认开启
            concatenateModules: true,
            // 开启优化，生产环境默认开启
            minimize: true,
            // 代码分割
            splitChunks: {
                chunks: 'all'
            },
            // 设置优化器
            minimizer: [
                // js 压缩, 去掉console.log
                new TeserWebpackPlugin({
                    parallel: true, // 使用多进程并发运行提高构建的速度，默认值是true
                    extractComments: false, // 默认值为true，表示会将注释抽取到一个单独的文件中；
                    terserOptions: {
                        format: {
                            comments: false, // 删除注释
                        },
                        compress: {
                            arguments: true,
                            unused: true, // 去除没有引用的变量和函数
                            // drop_console: true, // 去掉console.log
                            drop_console: ['log'], // 去掉console.log 保留console.*其他的方法
                            drop_debugger: true, // 去掉debugger
                        },
                        mangle: true, // 设置丑化相关的选项，可以直接设置为true；
                    }
                }),
                // css压缩
                new CssMinimizerPlugin({
                    parallel: true, // 并行压缩, 默认为true
                }),
            ]
        }
        // 静态资源输出到根目录
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(__dirname, 'public'),
                    to: './',
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/index.html"] // 忽略index.html文件
                    }
                }]
            }) 
        )
    }
    return config;
}