process.env.NODE_ENV = 'production'

var fs = require('fs')

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
fs.rmSync(assetsPath, { recursive: true, force: true })
fs.mkdirSync(assetsPath, { recursive: true })
for (var name of fs.readdirSync(path.resolve(__dirname, '../static'))) {
  if (name[0] !== '.') {
    fs.cpSync(path.resolve(__dirname, '../static', name), path.join(assetsPath, name), { recursive: true })
  }
}

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  if (stats.hasErrors()) process.exitCode = 1
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
