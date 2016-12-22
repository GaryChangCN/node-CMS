var db = require('../../lib/db');

module.exports = function*(next) {
    if (this.method.toUpperCase() == "GET") {
        var ctx = this;
        var _id = this.params._id;
        try {
            if (_id != 'first'&&_id!="extra"&&_id!="pinsetler") {
                var value=yield db.Group.findOne({ _id: _id }).exec();
                var tmp=[];
                var children=value.children;
                children.forEach(function(e){
                    tmp.push(db.Group.findOne({ _id: e }).exec().then(function(value){
                        if(value){
                            return value;
                        }else{
                            return db.Product.findOne({_id:e},'name englishName type').exec();
                        }
                    }));
                });
               
                var a=yield  Promise.all(tmp);
                this.body={
                    err:false,
                    state:true,
                    list:a,
                    extra:value.extra
                }
            } else if(_id=="first") {
                var _id='';
                var a=yield db.Group.findOne({ stage: 'root' }).exec().then(function(value){
                    if(!value){
                        return [];
                    }
                    var children=value.children;
                    _id=value._id;
                    var tmp=[];
                    children.forEach(function(_id){
                        tmp.push(db.Group.findOne({_id:_id},'name englishName').exec());
                    });
                    return Promise.all(tmp);
                })
                this.body={
                    err:false,
                    state:true,
                    _id,
                    list:a
                }
            }else if(_id=="extra"){
                var pinsetler =yield db.Group.count({extra:"pinsetler"}).exec().then(function(value){
                    if(value==0){
                        return false;
                    }else{
                        return true;
                    }
                });
                var lane=yield db.Group.count({extra:"lane"}).exec().then(function(value){
                    if(value==0){
                        return false;
                    }else{
                        return true;
                    }
                });
                var scroing=yield db.Group.count({extra:"scroing"}).exec().then(function(value){
                    if(value==0){
                        return false;
                    }else{
                        return true;
                    }
                });
                var oiling=yield db.Group.count({extra:"oiling"}).exec().then(function(value){
                    if(value==0){
                        return false;
                    }else{
                        return true;
                    }
                });
                this.body={
                    err:false,
                    state:true,
                    pinsetler,
                    lane,
                    scroing,
                    oiling
                }
            } else if(_id=="pinsetler"){
                var a=yield db.Group.findOne({extra:_id}).exec().then(function(value){
                    var tmp=[];
                    value.children.forEach(function(e){
                        tmp.push(db.Product.findOne({_id:e},'name englishName').exec());
                    });
                    return Promise.all(tmp);
                });
                this.body={
                    err:false,
                    state:true,
                    pinsetler:a
                }
            }
        } catch (error) {
            this.logger.error(error);
            yield next;
        }
    } else {
        yield next;
    }
}