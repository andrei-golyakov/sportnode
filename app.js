var express = require('express');
var http = require('http');
var path = require('path');
var i18n = require("i18n");
var everyauth = require('everyauth');

i18n.configure({
	locales: ['en', 'ru'],
	defaultLocale: 'en',
	cookie: 'language',
	directory: path.join(__dirname, 'locales')
});

var everyauthHelper = require('./lib/helpers/everyauthHelper');

var app = express();

everyauthHelper.setup(everyauth);

app.use(express.favicon())
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.session({ secret: 'secret' }));
app.use(everyauth.middleware(app));
app.use(i18n.init);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 8888);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(app.router);
var routes = require('./routes').routes(app);

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Node.js server listening on port ' + app.get('port'));
});
