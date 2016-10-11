
var koa = require('koa');
var serve = require('koa-static');

var app = koa();

app.use(serve(__dirname + '/static'));

// logger 
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('http node process time: %s %s - %s', this.method, this.url, ms);
});

// console.log(process.env)
app.listen(8080);





