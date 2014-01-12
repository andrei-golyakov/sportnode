/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		page: 'Home'
	});
};

/*
 * GET about page.
 */

exports.about = function(req, res) {
	res.render('about', {
		page: 'About'
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
