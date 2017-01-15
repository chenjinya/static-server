var koa = require('koa');
var serve = require('koa-static');
var route = new require('koa-route')
var app = koa();


//静态
app.use(serve(__dirname + '/static'));
//代理，代理以/proxy/开头，比如 /proxy/img/ala/test
app.use(route.get('/proxy/*', function * (name) {
    var urlPath = this.request.url;
    urlPath = urlPath.substr(6);
    console.log('Real Url:' , urlPath);
    var koaRouteThis = this;
    var content = '';  
    var request = require('sync-request');
    var hostStr = this.request.header['host'];

    //self-make proxy host start
    //ATENTION: last charactor not need '/'
    hostStr = 'https://www.baidu.com';
    if(urlPath.indexOf("/img") == 0) {
        hostStr = 'https://image.baidu.com';
    }
    //self-make proxy host end
    var willUrl = hostStr + urlPath;
    console.log('Proxy Url: ' ,willUrl);

    var headers = this.request.header;

    //self-make header start
    headers['host'] = 'www.xiu8.com';
    //self-make header end

    var res = request('GET', willUrl, {
      'headers': headers
    });

    var resHeaders = res.headers;
    this.set(resHeaders)
    this.body = res.getBody();
    console.log('Done Request');

}))
// logger 
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('http node process time: %s %s - %s', this.method, this.url, ms);
});


// console.log(process.env)
app.listen(8080);
