require('events').EventEmitter.prototype._maxListeners = 100;
var koa = require('koa');
var app = koa();
var logger = require('./lib/log');
var serve = require('koa-static-server')

var formidable = require('koa-formidable')
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: 'public/tmp',
    maxFieldsSize: 3145728,
    multiples: true
}));

app.use(serve({ rootDir: './public/pic', rootPath: '/api/media/pic' }));
app.use(serve({ rootDir: './public/pdf', rootPath: '/api/media/pdf' }));

app.context.logger=logger;

app.on('error', function(err, ctx) {
    logger.error(err.message);
    logger.error(err);
});
var router = require('koa-router')();
router.prefix('/api')
var err = require('./err');
var validLogin = require('./router/validLogin')

var verify = require('./router/verify');

router.get('/verify', verify);


var login = require('./router/login');
var search = require('./router/search');
router.post('/login', login);
router.get('/search', search, err);

var groupValid = require('./router/group/valid');
var groupPost = require('./router/group/post');
var groupUpdate = require('./router/group/update');
var groupGet = require('./router/group/get');
var groupDelete = require('./router/group/delete');
var pdf = require('./router/pdf');

router.post('/pdf', validLogin, groupValid, pdf, err);
router.all('/group', validLogin, groupValid, groupPost, groupUpdate, groupDelete, err);
router.get('/group/:_id', groupGet, err);


var productValid = require('./router/product/valid');
var productGetCount = require('./router/product/productGetCount');
var productGetLimit = require('./router/product/productGetLimit');
var productGetSearch = require('./router/product/productGetSearch');
var productGet = require('./router/product/productGet');
var productGet2 = require('./router/product/productGet2');
var productPost = require('./router/product/post');
var productUpdate = require('./router/product/update');
var productDelete = require('./router/product/delete');
var productWhere = require('./router/product/where');
var productGetArr = require('./router/product/productGetArr');

router.get('/product/count', productGetCount, err);
router.get('/product/get/:limit/:skip', productGetLimit, err);
router.get('/product/search/:keywords', productGetSearch, err);
router.get('/product/id/:_id', productGet, err);
router.get('/product/id2/:_id', productGet2, err);
router.get('/product/where/:_id', productWhere, err);
router.post('/product/arr', productGetArr, err);
router.all('/product', validLogin, productValid, productPost, productUpdate, productDelete, err);


var mediaValid = require('./router/media/valid');
var mediaGetSearch = require('./router/media/mediaGetSearch');
var mediaGetLimit = require('./router/media/mediaGetLimit');
var mediaGetCount = require('./router/media/mediaGetCount');
var mediaGetId = require('./router/media/mediaGetId');
var mediaPost = require('./router/media/post');
var mediaDelete = require('./router/media/delete');
var mediaUpdate = require('./router/media/update');

router.get('/media/id/:_id', mediaGetId, err);
router.get('/media/count/:kind', mediaGetCount, err);
router.get('/media/get/:kind/:limit/:skip', mediaGetLimit, err);
router.get('/media/search/:keywords', mediaGetSearch, err);
router.all('/media', validLogin, mediaValid, mediaPost, mediaUpdate, mediaDelete, err);
var orderValid = require('./router/order/valid');
var orderGetCount = require('./router/order/orderGetCount');
var orderGetId = require('./router/order/orderGetId');
var orderGetLimit = require('./router/order/orderGetLimit');
var orderGetSearch = require('./router/order/orderGetSearch');
var orderPost = require('./router/order/post');
var orderUpdate = require('./router/order/update');
var orderDelete = require('./router/order/delete');

router.get('/order/count/:type', orderGetCount, err);
router.get('/order/get/:type/:limit/:skip', orderGetLimit, err);
router.get('/order/search/:where/:keywords', orderGetSearch, err);
router.get('/order/id/:_id', orderGetId, err);
router.all('/order', orderPost, validLogin, orderValid, orderUpdate, orderDelete, err);

var userValid = require('./router/user/valid');
var userGet = require('./router/user/get');
var userPost = require('./router/user/post');
var userDelete = require('./router/user/delete');
var userUpdate = require('./router/user/update');
var validSuper = require('./router/user/validSuper');

router.post('/userSuper', validSuper);
router.all('/user', validLogin, userValid, userGet, userPost, userDelete, userUpdate, err);

var headValid = require('./router/head/valid');
var headDelete = require('./router/head/delete');
var headGet = require('./router/head/get');
var headPost = require('./router/head/post');
var headUpdate = require('./router/head/update');

router.all('/head', validLogin, headValid, headDelete, headGet, headPost, headUpdate, err);

var styleValid = require('./router/style/valid');
var stylePost = require('./router/style/post');
var styleGet = require('./router/style/get');
var getSuggest=require('./router/style/getSuggest');

router.get('/style/:type', styleGet, err);
router.get('/getsuggest', getSuggest, err);
router.all('/style', validLogin, styleValid, stylePost, err);

var articleValid = require('./router/article/valid');
var articlePost = require('./router/article/post');
var categoryPost = require('./router/article/categoryPost');
var articleGetAllTitle = require('./router/article/getTitle');
var categoryGet = require('./router/article/getCategory');
var articleGetId = require('./router/article/getId');
var articleUpdate = require('./router/article/update');
var articleDelete = require('./router/article/delete');

router.get('/article/id/:_id', articleGetId, err);
router.get('/article/category/:type', articleGetAllTitle, categoryGet, err);
router.all('/article', validLogin, articleValid, articlePost, categoryPost, articleUpdate, articleDelete, err);

app.use(router.routes());
app.use(router.allowedMethods())


app.listen(3000, function() {
    console.log("listen on 3000");
});