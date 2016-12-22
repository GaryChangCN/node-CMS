var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bowling');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username: String,
    password: String,
    limit: {
        type: Array,
        default: []
    },
    superUser: {
        type: Boolean,
        default: false
    }
});

adminSchema.statics.valida = function(obj, cb) {
    this.findOne({ username: obj.username, password: obj.password }, cb);
}

var Admin = mongoose.model('admin', adminSchema);

var groupSchema = new Schema({
    name: String,
    englishName: String,
    type: {
        type: String,
        default: "group"
    },
    extra:{
        type:String,
        default:"",
    },
    stage: String,
    children: {
        type: Array,
        default: []
    }
});


var Group = mongoose.model('group', groupSchema);

var productSchema = new Schema({
    name: String,
    englishName: String,
    description: String,
    englishDescription: String,
    media: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: "product"
    },
    number: {
        type: String
    }
});

var Product = mongoose.model('product', productSchema);

var mediaSchema = new Schema({
    name: String,
    rename: String,
    englishName: String,
    type: String,
    link: {
        type: String,
        default: 'local-pic'
    }
});

var Media = mongoose.model('media', mediaSchema);

var orderSchema = new Schema({
    where: {
        type: String,
        default: "unhandled"
    },
    saleManager: {
        type: String,
        default: "默认管理员"
    },
    adminBoard: {
        type: String,
        default: "空"
    },
    star: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: "表单标题"
    },
    head: {
        type: String,
        default: "请选择抬头"
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    time: {
        type: Date
    },
    sum: {
        type: Number,
        default: 0
    },
    number: {
        type: Number
    },
    money: String,
    customerName: {
        type: String,
        default: "匿名客户",
    },
    customerCompany: {
        type: String,
        default: ""
    },
    customerContact: String,
    customerBoard: {
        type: String,
        default: "空"
    },
    customerTime: {
        type: Date
    },
    customerProduct: {
        type: Array,
        default: []
    }
});

orderSchema.pre('save', function(next) {
    var now = new Date();
    this.customerTime = now;
    this.time = now;
    this.number = now.getTime();
    next();
});

var Order = mongoose.model('order', orderSchema);

var headSchema = new Schema({
    name: String,
    address: String,
    contact: String
});

var Head = mongoose.model('head', headSchema);

var styleSchema = new Schema({
    type: String,
    array: Array
});

var Style = mongoose.model('style', styleSchema);

var articleSchema=new Schema({
    type:String,
    content:{
        type:String,
        default:""
    },
    time:{
        type:Date
    },
    title:{
        type:String,
        default:""
    },
    link:{
        type:String,
        link:""
    },
    array:{
        type:Array,
        default:[]
    }
});

articleSchema.pre('save', function(next) {
    var now = new Date();
    this.time = now;
    next();
});

var Article=mongoose.model('article',articleSchema);

module.exports = {
    Admin: Admin,
    Group: Group,
    Media: Media,
    Product: Product,
    Order: Order,
    Head: Head,
    Style: Style,
    Article:Article
}