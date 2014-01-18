var ensureLanguage = require("../lib/helpers/routingLanguageHelper").ensureLanguage;

/*
 * GET home page.
 */

exports.index = function(req, res) {
	if (!ensureLanguage(req, res)) {
		return;
	}
	res.render('index', {
		page: 'Home',
		locale: req.locale
	});
};

/*
 * GET about page.
 */

exports.about = function(req, res) {
	if (!ensureLanguage(req, res)) {
		return;
	}
	res.render('about', {
		page: 'About',
		locale: req.locale
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
