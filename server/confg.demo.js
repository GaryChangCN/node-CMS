module.exports={
    
    cookie:function *(next) {
        this.app.keys=["cookiekey"];
        yield next;
    }
}