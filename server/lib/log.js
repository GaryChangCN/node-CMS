var log4js = require("log4js");
var path = require('path');
log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: __dirname + '/../log/log.log',
            maxLogSize: 20480,
            backups: 3
        }
    ],
    replaceConsole:true
});
var logger = log4js.getLogger(path.basename(__filename));
//var otherLogger=log4js.getLogger('other');

module.exports = logger;