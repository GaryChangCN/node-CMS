require('events').EventEmitter.prototype._maxListeners = 100;
var koa = require('koa');
var app = koa();
var logger = require('./lib/log');
var formidable = require('koa-formidable')
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: 'public/tmp',
    multiples: true
}));

app.context.logger=logger;

app.on('error', function(err, ctx) {
    logger.error(err.message);
    logger.error(err);
});
var router = require('koa-router')();

var template=require('art-template');
template.config('base','views');
template.config('encoding','utf-8');
template.config('extname','.html');
app.context.render=template;

app.context.render=template;

var err = require('./renderErr');

var index=require('./render-router/index');
router.get('/index.html',index,err).get('/',index,err);
router.get('/support.html',require('./render-router/support'),err);
router.get('/library.html',require('./render-router/library'),err);
router.get('/article.html',require('./render-router/article'),err);
router.get('/project.html',require('./render-router/project'),err);
router.get('/center.html',require('./render-router/center'),err);
router.get('/center-detail.html',require('./render-router/center-detail'),err);
router.get('/contactus.html',require('./render-router/contactus'),err);
router.get('/equipment-list.html',require('./render-router/equipment-list'),err);
router.get('/equip-product.html',require('./render-router/equip-product'),err);
router.get('/equipment-detail.html',require('./render-router/equipment-detail'),err);
router.get('/part-product.html',require('./render-router/part-product'),err);
router.get('/quote.html',require('./render-router/quote'),err);
router.get('/search.html',require('./render-router/search'),err);
router.get(/(\/|\/404)/,function*(next){
    this.body=this.render('./view/404', {
        chinese: this.query.language ? false : true,
        title: '404 not found'
    });
},err);

app.use(router.routes());
app.use(router.allowedMethods())


app.listen(3001, function() {
    console.log("listen on 3001");
});