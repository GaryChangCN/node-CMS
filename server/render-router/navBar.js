var db=require('../lib/db');

var logo= db.Style.findOne({type:'logo'},'array').exec().then(function(value){
    if(!value){
        return {logo:{}};
    }else{
        return {logo:value.array[0]};
    }
});
var panelPicture= db.Style.findOne({type:'panelPicture'},'array').exec().then(function(value){
    if(!value){
        return {panelPicture:{}};
    }else{
        return {panelPicture:value.array[0]};
    }
});
var placeholder= db.Style.findOne({type:'placeholder'},'array').exec().then(function(value){
    if(!value){
        return {placeholder:{}};
    }else{
        return {placeholder:value.array[0]};
    }
});
var product=db.Group.findOne({stage:'root'}).exec().then(function(res){
    var firstId=res.children;
    var tmp=[];
    firstId.forEach(function(e){
        tmp.push(db.Group.findOne({_id:e}).exec().then(function(value){
            var secondId=value.children;
            var tmp2=[];
            secondId.forEach(function(e){
                tmp2.push(db.Group.findOne({_id:e}).exec().then(function(v){
                    return {
                        _id:v._id,
                        name:v.name,
                        englishName:v.englishName,
                        extra:v.extra
                    }
                }));
            });
            return Promise.all(tmp2).then(function(children){
                return {
                    id_:value._id,
                    name:value.name,
                    englishName:value.englishName,
                    children:children
                }
            })
        }))
    })
    return Promise.all(tmp).then(function(res){
        return {
            product:res
        }
    })
})


module.exports=Promise.all([logo,panelPicture,placeholder,product]).then(function(value){
    var tmp={};
    value.forEach(function(e){
        for(var key in e){
            tmp[key]=e[key];
        }
    });
    return tmp;
});
