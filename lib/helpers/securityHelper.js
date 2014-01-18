exports.ensureUserLoggedIn = function(req, res) {
	if (!req.user) {
		res.redirect('/' + req.locale).end();
		return false;
	}

	return true;
};

exports.ensureUserLoggedInAjax = function(req, res) {
	if (!req.user) {
		res.send(401).end();
		return false;
	}

	return true;
};
