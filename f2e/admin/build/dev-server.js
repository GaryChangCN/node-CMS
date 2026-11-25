var fs = require('fs')
var os = require('os')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('../config')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware').createProxyMiddleware
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'node-cms-admin-'))
webpackConfig.output.path = outputPath
var compiler = webpack(webpackConfig)
process.on('exit', function() {
    fs.rmSync(outputPath, { recursive: true, force: true })
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// Keep Webpack 1's watcher for this legacy app, but serve only its generated
// output from a private directory via Express rather than the old middleware.
var finishFirstBuild
var hasBuild = false
var firstBuild = new Promise(function(resolve) { finishFirstBuild = resolve })
var watcher = compiler.watch({}, function(err, stats) {
    if (err) console.error(err)
    else if (stats.hasErrors()) console.error(stats.toString({ colors: false, errorDetails: true, modules: false, chunks: false }))
    else hasBuild = true
    finishFirstBuild()
})
app.use(hotMiddleware)
app.use(function(req, res, next) {
    firstBuild.then(function() {
        if (hasBuild) next()
        else res.status(503).send('Development assets did not compile; check the build log.')
    }, next)
})
app.use(express.static(outputPath))

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// This legacy development server must never be exposed to the public network.
module.exports = app.listen(port, '127.0.0.1', function(err) {
    if (err) {
        console.log(err)
        return
    }
    // var uri = 'http://localhost:' + port
    // console.log('Listening at ' + uri + '\n')
    var uri = 'http://127.0.0.1:' + port
    console.log('Listening at ' + uri + '\n')
    if (process.env.BROWSER !== 'none') opn(uri).catch(function() {})
})
module.exports.on('close', function() { watcher.close(function() {}) })
if (require.main === module) {
    ['SIGINT', 'SIGTERM'].forEach(function(signal) {
        process.once(signal, function() {
            module.exports.close()
            module.exports.closeAllConnections()
        })
    })
}
