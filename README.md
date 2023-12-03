# webpack5-vue
使用webpack5配置vue

#### 初始化项目

1. 初始化package.json

```bash
> pnpm init
> git init
> echo 'dist\n node_modules' >> .gitignore
```

2. 安装webpack依赖

```bash
> pnpm add webpack webpack-cli -D
```

3. 初始化项目和文件

- 创建webpack.config.js配置文件

```
webpack.config.js #webpack配置
```

- 创建src目录用于存放源代码

4. 配置webpack-dev-server

```bash
> pnpm add webpack-dev-server -D
```

5. 安装cross-env 跨环境变量辅助工具

```
> pnpm add cross-env -D
```

6. 修改package.json, 在scripts中命令

```json
scripts: {
    "start": "cross-env NODE_ENV=development webpack serve --config=./webconfig.config.js",
    "build": "cross-env NODE_ENV=production webpack --config=./webpack.config.js"
}
```

#### 配置

目录打包后放入dist目录，打包后的css文件将放入到static/css目录，图片将放入到static/image目录，js文件放入到static/js目录，字体文件放在static/font目录。打包后的目录结构如下：

```bash
- public
  L index.html  # html模版
  L favicon.ico # 
- dist # 打包目录
  L static # 资源
    L font # 字体
    L css 
    L image
    L js
    L media
  L index.html # 生成的打包首页
```

1. 初始化配置 webpack.config.js

```javascript
const path = require('path'); // 引入path内置模块

const isProduction = process.env.NODE_ENV=='production'  // 判断是否为生产环境

module.exports = {
    mode: isProduction ? 'production' : 'development',  // 根据环境设置mode
    entry: './src/main.js', // 打包入口
    output: {
        clean: true, // 每次构建前清空目标目录
        path: path.resolve(__dirname, 'dist'), // 打包目录
        filename: 'js/[name].[contenthash:8].bundle.js', // 主js文件名
        chunkFilename: 'js/[name].[contenthash:8].chunk.js', // chunk文件名
        assetModuleFilename: 'static/[name].[hash:8].[ext]' // 通用资源目录
    },
    devtool: isProduction ? false : 'inline-source-map', // 根据环境设定sourcemap生成方式
    module: {
        rules: [
            // 各种解析
        ]
    },
    resolve: {
        // 模块解析
    },
    externals: {
        // 外部扩展
    },
    plugins: [
        // 插件
    ],
    devServer: {
        static: 'public', // 设定额外的静态资源路径
        hot: true,
    }
}
```

2. 配置html文件动态生成

```bash
> pnpm add html-webpack-plugin -D
```

配置插件：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack5+vue示例',
            filename: 'index.html',
            template: './public/index.html'
        }) 
    ]
    // ...
}
```

3. 配置常规解析规则

需要安装的依赖如下：

```bash

# 解析css/less/sass/stylus
pnpm add style-loader css-loader less-loader less sass-loader sass stylus-loader stylus postcss-loader postcss postcss-preset-env -D

# 抽离css
pnpm add mini-css-extract-plugin -D

# babel
pnpm add babel-loader @babel/core @babel/preset-env core-js -D
```

配置文件如下：

```javascript
//...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProduction = process.env.NODE_ENV=='production'

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

module.exports = {
    // ...
    module: {
        rules: [
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
        // extensions: ['.ts','.tsx','...']
    },
    //...
    plugins: [
        // 插件
        // 对抽离出的css文件进行重命名
        new MiniCssExtractPlugin({
            filename: 'static/css/[contenthash].css',
            chunkFilename: 'static/css/[contenthash]_chunk.css',
        }),
        //...
    ]
}
```

配置postcss.config.js 和 babel.config.js :

```javascript
// postcss.config.js
module.exports = {
    plugins: [
        [
            "postcss-preset-env", 
            {   
                "browserslist": [
                    "last 2 version", 
                    "> 1%", 
                    "not dead"
                ]
            }
        ]
    ]
}
// babel.config.js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": {
                    chrome: '60',
                    ie: '9' // 等等
                },
                "corejs": "3",
                "useBuiltIns": "usage"
            }
        ]
    ]
}
```

4. 配置解析vue

安装vue-loader 和 vue :

```bash
pnpm add vue-loader -D
pnpm add vue -S
```

配置vue-loader:

```javascript
const {VueLoaderPlugin} = require('vue-loader')
const {DefinePlugin} = require('webpack')

module.exports = {
    // ...
    module: {
        rules: [
            // 各种解析
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },
    //...
    plugins: [
        // 插件
        // ...
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(true)
        })
    ]
}
```

:::warning vue-loader

vue-loader： 用于对.vue结尾的文件进行解析
VueLoaderPlugin： 来补充vue-loader在处理vue的时候，它处理了模板里面的HTML，但是它不知道怎么处理里面的js，和css，就需要这个插件来补充，所以就通过这个插件告诉vue-loader，当遇到这些文件时，让我们之前配置过得loader去处理相应的文件

__VUE_OPTIONS_API__: 该全局常量用于是否启用选项式api
__VUE_PROD_DEVTOOLS__: 生产环境开发工具是否开启
:::

5. ts 配置

typescript 让vue更加规整，因此配置typescript。

安装依赖：

```bash
pnpm add typescript ts-loader -D
```

配置ts-loader:

```javascript
module.exports = {
    // ...
     module: {
        rules: [
            //...
            {
                test: /\.tsx?/i,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/], // 这句相当重要，不设定将无法对.vue中的ts进行识别，在解析.vue文件时传入参数ts=true
                            configFile: path.resolve(__dirname, 'tsconfig.json'), // ts解析配置
                        }
                    }
                ]
            },
            // ...
        ]
    },
    //...
}
```

tsconfig.json 配置：

```json
{
  "compilerOptions": {
    "target": "ESNext",       //                            
    "module": "ESNext",       // 这里一定不能设定成commonjs，否则无法完整的使用tree shaking                                                         
    "moduleResolution": "node",                    
    "allowJs": true,                                   
    "esModuleInterop": true,                            
    "forceConsistentCasingInFileNames": true,          
    "strict": true,                                     
    "noImplicitAny": false,       // 允许使用any类型                   
    "skipLibCheck": true,   
    // 这样ts中才会解析@符，很重要
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // ts中解析@ 别名
    }
  },
}
```

添加typescript识别vue、png等模块, 添加shims-vue.d.ts类型声明文件，只要是`.d.ts`结尾的文件即可。 以免编译器提示不识别错误。

```typescript
// shims-vue.d.ts
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.png'
```

添加模块路径后缀识别：

```javascript
module.exports = {
    resolve: {
        extensions: ['.ts','.tsx','...']
    }
}
```

这样webpack5 + vue3 + typescript的基本配置完毕，接下来优化打包配置。

6. 优化配置

安装依赖：

```bash
pnpm add css-minimizer-webpack-plugin -D # css压缩
pnpm add copy-webpack-plugin - D # 静态资源拷贝
```

配置生产优化：

```javascript
module.exports = () => {
    // 如果是生产环境
    if(isProduction) {
        // 开启优化
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
```
完善HtmlWebpackPlugin，设置html 压缩：

```javascript

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
})
```

对tree shaking的补充设置：

```json
// package.json
{
    "sideEffects": ["*.css","*.less","*.sass","*.styl","*.vue"]
}
```

对不改变的引用模块采用外部扩展引用的方式：

```javascript
const config = {
    // ...
    externals: {
        // 外部扩展
        'vue': 'Vue',
        'vue-router': 'VueRouter'
    },
    //...
}
```

修改public/index.html模版：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
    <div id="app"></div>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue-router/4.2.4/vue-router.global.prod.min.js"></script>
</body>
</html>
```

#### 完整的webpack配置

```javascript
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
```