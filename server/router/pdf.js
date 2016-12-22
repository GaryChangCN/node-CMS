var artTemplate = require('art-template');
var path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "POST") {
        try {
            var ctx = this;
            var data = this.request.body;
            var p = path.normalize(path.dirname(__filename) + '/../views/orderPageTemplate');
            data.tableList=data.tableList.map(function(e){
                if(/^\/api/.test(e.media)){
                   e.media=ctx.request.header.origin+e.media;
                }
                return e;
            });
            var html = artTemplate(p, data);
            var opt = {
                format: 'A4'
            }
            var p = new Promise(function(reslove, reject) {
                pdf.create(html, opt).toStream(function(err, stream) {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(stream);
                    }
                });
            }).then(function(stream) {
                stream.pipe(fs.createWriteStream(path.normalize(path.dirname(__filename) + '/../public/pdf/' + data.numberValue + '.pdf')));
            })
            var a = yield p;
            this.body = {
                state: true,
                err: false,
                name: data.numberValue + '.pdf'
            };
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}