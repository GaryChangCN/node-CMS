var db = require('../../lib/db');

module.exports = function*(next) {
    try {
        var a = yield db.Style.findOne({ type: "equipmentdetail" },'array');
        var list=a.array[0];
        var suggestList=[];
        for(var key in list){
            suggestList.push({
                _id:key,
                suggest1:list[key].suggest1,
                suggest2:list[key].suggest2,
                suggest3:list[key].suggest3
            })
        }
        this.body = {
            suggestList
        }
    } catch (error) {
        this.logger.error(error);
        yield next;
    }
}