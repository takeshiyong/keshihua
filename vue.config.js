module.exports = {
      publicPath: '/dataview-resource/',
      chainWebpack: config => {
        config.module
          .rule('swf')
          .test(/\.swf$/)
          .use('url-loader')
            .loader('url-loader')
            .tap(options => {
              return {
                  limit: 1024,
                  name: 'file/[path][name].[hash7].[ext]'
              }
            })
            .end()
    },
    devServer: {
      // proxy: {
      //   '/api': {
      //     target: 'https://172.31.120.61:8080/',
      //     ws: true,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '^/api': ''
      //     }
      //   }
      // },
      // 开启https 访问时使用https://172.31.120.61:8081 
      // https://localhost:8081 也可以访问，不过自带info请求会报错 不清楚具体原因
      // https: true
    }
}

