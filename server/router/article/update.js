var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "PUT") {
        try {
            var ctx = this;
            var _id = this.request.body._id;
            var content=ctx.request.body.content;
            var title=ctx.request.body.title;
            var link=ctx.request.body.link;
            var data={
                content:content,
                link:link,
                title:title,
                type:'article',
                time:new Date()
            };
            yield db.Article.update({_id:_id},data).exec();
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