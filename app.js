var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compression = require('compression');
var errorhandler = require('errorhandler');
var i18n = require('i18n');
var everyauth = require('everyauth');
var forceDomain = require('node-force-domain');
var connectMssql = require('connect-mssql');
var bundleup = require('bundle-up3');
var assets = require('./lib/helpers/assets');
var config = require('./lib/helpers/config').config;
var everyauthHelper = require('./lib/helpers/everyauthHelper');
var fakeauthHelper = require('./lib/helpers/fakeauthHelper');

i18n.configure({
	locales: ['en', 'ru'],
	defaultLocale: 'en',
	cookie: 'language',
	updateFiles: false,
	directory: path.join(__dirname, 'locales')
});

var app = express();

everyauthHelper.setup(everyauth);

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.secretKeys.cookie));
var mssqlStorage = connectMssql(session);
app.use(session({
    store: new mssqlStorage(config.mssql),
    secret: config.secretKeys.session,
    resave: true,
    saveUninitialized: true
}));
app.use(compression());

if ('production' == app.get('env')) {
	app.use(forceDomain(config.forceDomain));
}

if ('development' === app.get('env')) {
	fakeauthHelper.setup(config.fakeDevUser);
	app.use(fakeauthHelper.middleware());
}

app.use(everyauth.middleware(app));
app.use(i18n.init);
app.use(require('less-middleware')(path.join(__dirname, 'public')));

bundleup(app, assets, {
  staticRoot: path.join(__dirname, 'public'),
  staticUrlRoot: '/',
  bundle: true,
  minifyCss: false,
  minifyJs: true,
  asyncJs: false,
  complete: console.log.bind(console, "Bundle-up: static files are minified/ready")
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 8888);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

var router = require('./routing/routes').setup();
app.use('/', router);

if ('development' === app.get('env')) {
	app.use(errorhandler());
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Node.js server listening on port ' + app.get('port') + '.');
	console.log('Node.js works in ' + app.get('env') + ' environment.');
});
