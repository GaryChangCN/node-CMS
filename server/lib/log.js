var log4js = require('log4js');
var path = require('path');
var fs = require('fs');
var logDirectory = path.join(__dirname, '../log');
fs.mkdirSync(logDirectory, { recursive: true });
log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'file',
            filename: path.join(logDirectory, 'log.log'),
            maxLogSize: 20480,
            backups: 3,
            mode: 0o600
        }
    },
    categories: { default: { appenders: ['console', 'file'], level: 'info' } }
});
module.exports = log4js.getLogger(path.basename(__filename));
