var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var i18n = require("i18n");
var everyauth = require('everyauth');
var forceDomain = require('node-force-domain');
var fs = require('fs');

i18n.configure({
	locales: ['en', 'ru'],
	defaultLocale: 'en',
	cookie: 'language',
	updateFiles: false,
	directory: path.join(__dirname, 'locales')
});

var everyauthHelper = require('./lib/helpers/everyauthHelper');

var privateKey  = fs.readFileSync('./config/ssl-old-key.pem', 'utf8');
var certificate = fs.readFileSync('./config/ssl-old-certif.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();

everyauthHelper.setup(everyauth);

app.use(express.favicon())
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.session());
app.use(express.compress());
if ('production' == app.get('env')) {
	app.use(forceDomain(JSON.parse(fs.readFileSync('./config/deploy.json'))));
}
app.use(everyauth.middleware(app));
app.use(i18n.init);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 8888);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(app.router);
var routes = require('./routing/routes').routes(app);

if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Node.js server listening on port ' + app.get('port'));
});
https.createServer(credentials, app).listen(443, function(){
	console.log('Node.js server listening on port 443');
});