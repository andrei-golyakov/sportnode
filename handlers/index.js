var userManagerFactory = require('../lib/data/userManagerFactory').UserManagerFactory;
var userManager = userManagerFactory.createUserManager();
var tm = require('../lib/helpers/translationManager');

/*
 * GET home page.
 */

exports.index = function(req, res) {
	userManager.getUser(req, function(user) {
		var o = {
			page: 'Home',
			lang: tm.translations(res, 'index')
		};

		if (user) {
			o['user'] = user;
		}
		console.log(o);
		res.render('index', o);
	});
};

/*
 * POST login form.
 */

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

/*
 * POST logout form.
 */

exports.logout = function(req, res) {
	delete req.session.userId;
	res.send({ authorized: false });
	res.end();
};