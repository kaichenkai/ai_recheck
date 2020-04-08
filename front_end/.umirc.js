
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      // title: '对比结果查询',
      title: 'AI车牌复核系统',
      dll: true,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  targets: {
    firefox: 42
  },
  // 配置代理
  proxy: {
    '/api': {
      // target: 'http://10.10.19.250:5000',
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    },
    '/pause': {
      // target: 'http://10.10.19.250:5000',
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    },
    '/restart': {
      // target: 'http://10.10.19.250:5000',
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    },
    '/favicon.ico': {
      // target: 'http://10.10.19.250:5000',
      target: 'http://127.0.0.1:5000',
      changeOrigin: true
    },
  }
}
