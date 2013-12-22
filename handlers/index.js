/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		page: 'Home'
	});
};

/*
 * GET logout
 */

exports.logout = function(req, res) {
	req.logout();
	res.send({ authorized: false });
	res.end();
};
