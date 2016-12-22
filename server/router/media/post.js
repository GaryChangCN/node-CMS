var db = require('../../lib/db');
var fs = require('fs');
var path = require('path');
module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var info = JSON.parse(this.request.body.info);
            var type = this.request.body.type;
            var name = this.request.body.name;
            var englishName = this.request.body.englishName;
            var tmp=[];
            if (type == "video") {
                var link = this.request.body.link;
                var s = new db.Media({
                    name: name,
                    englishName: englishName,
                    rename: rename,
                    type: "video",
                    link: link
                });
                tmp.push(s.save());
            } else if (type == "picture") {
                var fArr = this.request.files.file;
                if (!Array.isArray(fArr)) {
                    fArr = [fArr];
                }
                fArr.forEach(function(f, index) {
                    var $path = path.normalize(f.path);
                    var rename = $path.split(/(\/|\\)/).pop();
                    var mime = f.name.split(".").pop();
                    fs.renameSync(path.join(__dirname + '/../../', $path), path.join(__dirname + '/../../', '/public/pic/' + rename + '.' + mime));
                    var s = new db.Media({
                        name: info[index].name||"",
                        englishName: info[index].englishName||"",
                        rename: rename,
                        type: "picture",
                        link: rename + "." + mime
                    });
                    tmp.push(s.save());
                })
            } else {
                yield next;
            }
            var a =yield Promise.all(tmp);
            this.body = {
                state: true,
                err: false
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }

}