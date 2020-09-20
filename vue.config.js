module.exports = {
  "transpileDependencies": [
    'vue-echarts',
  ],
    "devServer": {
      proxy: {
        '/api': {
          target: 'https://www.bilibili.com', //对应自己的接口
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
}