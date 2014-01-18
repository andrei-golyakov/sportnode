var i18n = require("i18n");

exports.ensureLanguage = function(req, res) {
	var lang;
	var regexRes = /^\/(en|ru)($|\/)/i.exec(req.url);

	if (regexRes != null) {
		lang = regexRes[1].toLowerCase();
	}

	if(typeof lang === 'undefined' || lang === null) {
		lang = req.locale;
		setCookie(res, lang);
		res.redirect(beautifyUrl('/' + lang + req.url));
		res.end();
		return false;
	}

	setCookie(res, lang);
	i18n.setLocale(req, lang);
	return true;
};

function setCookie(res, lang) {
	res.cookie('language', lang, { maxAge: 900000 });
}

function beautifyUrl(url) {
	return url.replace(/\/$/, '');
}