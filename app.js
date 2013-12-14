var express = require('express');
var http = require('http');
var path = require('path');
var everyauth = require('everyauth');
var fs = require('fs');

var app = express();

var usersById = {};

//everyauth.debug = true;
var conf = JSON.parse(fs.readFileSync(__dirname + '/config/auth.json')); 

everyauth.everymodule.findUserById( function (id, callback) {
	callback(null, usersById[id]);
});

everyauth.facebook
	.appId(conf.fb.appId)
	.appSecret(conf.fb.appSecret)
	.fields('id,name,email,picture')
	.findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
		user = fbUserMetadata;
		usersById[user.id] = fbUserMetadata;
		var promise = this.Promise();
		promise.fulfill(user);
		return promise;
	})
	.redirectPath('/');

app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('5UP3RS3CRE7'));
app.use(express.session('5UP3RS3CRE7'));
app.use(everyauth.middleware());
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