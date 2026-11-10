var schedule = require("node-schedule");
var child_process = require("child_process");
var path = require("path");
var fs = require("fs-extra");
var archiver = require("archiver");
var logger = require('./lib/log');
function startSchedule() {
    try {
        //每天的23点23分23秒备份一次到本地 c:/beifen
        var monodb = schedule.scheduleJob("23 23 23 * * *", function() {
            (function() {
                child_process.exec('mongodump -h 127.0.0.1:27017 -d bowling -o c:\\beifen', function(error, stdout, stderr) {
                    if (error) {
                        throw error;
                    } else {
                        setTimeout(function() {
                            var date = new Date();
                            var time = date.getTime();
                            fs.move(path.normalize("c:\\beifen\\bowling"), path.normalize("c:\\beifen\\" + time), function(error) {
                                if (error) {
                                    throw error;
                                } else {
                                    logger.info("数据库到本地成功："+time);
                                    var dirArr = fs.readdirSync(path.normalize("c:\\beifen"));
                                    if (dirArr.length > 7) {
                                        var min = Math.min(...dirArr);
                                        fs.remove(path.normalize("c:\\beifen\\" + min), function(err) {
                                            if (err) {
                                                throw err;
                                            }else{
                                                logger.info("已清除七天前数据库本地存档");
                                            }
                                        })
                                    }
                                }
                            });
                        }, 5000)
                    }
                })
            })();
        });
        //每周日 23点 40分 40秒 备份到七牛 
        var qiniu = schedule.scheduleJob("40 40 23 * * 7", function() {
            (function() {
                var dirArr = fs.readdirSync(path.normalize("c:\\beifen"));
                if (dirArr.length >= 7) {
                    var max = Math.max(...dirArr);
                    var output = fs.createWriteStream(path.normalize("c:\\beifen\\" + max + ".zip"));
                    var archive = archiver("zip", { store: true });
                    archive.on("error", function(err) {
                        throw err;
                    });
                    archive.pipe(output);
                    archive.directory(path.normalize("c:\\beifen\\" + max + "\\"));
                    archive.finalize();
                    setTimeout(function() {
                        var qiniu = require("qiniu");
                        // Set these in the environment; never commit cloud credentials.
                        var mac = new qiniu.auth.digest.Mac(process.env.QINIU_ACCESS_KEY, process.env.QINIU_SECRET_KEY);
                        var bucket = process.env.QINIU_BUCKET || 'backupdatabase';
                        var date = new Date();
                        var key = date.toISOString().replace(/[:.]/g, '-') + '.zip';
                        var policy = new qiniu.rs.PutPolicy({ scope: bucket + ':' + key });
                        var token = policy.uploadToken(mac);
                        var filePath = path.normalize("c:\\beifen\\" + max + ".zip");
                        var uploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config());
                        uploader.putFile(token, key, filePath, new qiniu.form_up.PutExtra(), function(err, ret, info) {
                            if (err || !info || info.statusCode !== 200) {
                                logger.error(err || new Error('Qiniu backup upload failed'));
                                return;
                            }
                            logger.info("已将最近一天数据库副本储存到七牛云");
                            fs.remove(filePath, function(error) { if (error) logger.error(error); });
                        });
                    }, 5000);
                }
            })();
        });
    } catch (error) {
        logger.error(error);
    }
}
startSchedule();