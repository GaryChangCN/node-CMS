var logger = require('./lib/log');
module.exports = function*(next) {
    this.redirect('/404');
    logger.error("出现了错误,不存在的地址");
}