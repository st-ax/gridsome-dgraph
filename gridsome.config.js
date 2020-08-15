// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const merge = require('webpack-merge')
const webpack = require('webpack')
const WorkerPlugin = require('worker-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  siteName: 'Gridsome JSON editor',
  plugins: [],
  configureWebpack(config) {
    return merge({ 
      output: {
        globalObject: "(typeof self!='undefined'?self:global)"
      },
      // node: { crypto: true, stream: true, buffer: true },
      plugins: [
        new WorkerPlugin(),
        new CompressionPlugin(),
        // new webpack.IgnorePlugin(/crypto/), // attempts to get gridsome build ssr working - seemed to get past the errors but then failed when coreui looked for document
        // new webpack.IgnorePlugin(/http/),
        // new BundleAnalyzerPlugin(),
      ],
      // chainWebpack: config => {
      //   config.plugin().use(new webpack.IgnorePlugin(/crypto/))
      // },
    }, config)
  }
}
