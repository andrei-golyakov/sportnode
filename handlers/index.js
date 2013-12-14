/*
 * GET home page.
 */

exports.index = function(req, res) {
	var o = { page: 'Home' };
	res.render('index', o);
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