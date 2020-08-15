// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const merge = require('webpack-merge')
const WorkerPlugin = require('worker-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  siteName: 'Gridsome JSON editor',
  plugins: [],
  configureWebpack(config) {
    return merge({ 
      output: {
        globalObject: "(typeof self!='undefined'?self:global)"
      },
      plugins: [
        new WorkerPlugin(),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin()
      ]
    }, config)
  }
}
