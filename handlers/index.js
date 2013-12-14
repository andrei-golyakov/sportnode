var everyauth = require('everyauth');

var userManagerFactory = require('../lib/data/userManagerFactory').UserManagerFactory;
var userManager = userManagerFactory.createUserManager();

/*
 * GET home page.
 */

exports.index = function(req, res) {
	if (req.session.auth) {
		console.log(JSON.stringify(req.session.auth.facebook));
	}

	userManager.getUser(req, function(user) {
		var o = { page: 'Home' };
		if (user) {
			o['user'] = user;
		}
		res.render('index', o);
	});
};

exports.login = function(req, res) {
	userManager.authorizeUser(req.body.email, req.body.passwordHash, function(userId) {
		var result = { authorized: false }
		if (userId) {
			req.session.userId = userId;
			result.authorized = true;
		}
		res.send(result);
		res.end();
	});
};

exports.logout = function(req, res) {
	delete req.session.userId;
	res.send({ authorized: false });
	res.end();
};