/*
 * GET home page.
 */

exports.index = function(req, res) {
	var o = { page: 'Home' };
	res.render('index', o);
};

/*
 * GET logout
 */

exports.logout = function(req, res) {
	req.logout();
	res.send({ authorized: false });
	res.end();
};
