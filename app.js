var express = require('express');
var http = require('http');
var path = require('path');
var i18n = require("i18n");

i18n.configure({
	locales: ['en', 'ru'],
	defaultLocale: 'en',
	cookie: 'language',
	directory: path.join(__dirname, 'locales')
});

var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('5UP3RS3CRE7'));
app.use(express.cookieSession());
app.use(i18n.init);
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes').routes(app);

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Node.js server listening on port ' + app.get('port'));
});