// outdated

(function(){
	var fs = require('fs');
	var path = require('path');

	function DemoUserManager() {
		var user = null;
		var fname = './config/user.json';
		fs.exists(fname, function(exists) {
			if (exists) {
				fs.readFile(fname, function (error, data) {
					user = JSON.parse(data);
				});
			} else {
				user = {
					"id": "guid",
					"login": "login",
					"passwordHash": "md5 hash",
					"name": "John Doe"
				};
				console.log(user);
			}
		});

		function demoUserManager() {}

		demoUserManager.prototype = {
			getUser: function(req, callback) {
				var currentUser = (req.session.userId === user.id)
					? user
					: null;
				callback(currentUser);
			},

			authorizeUser: function(login, passwordHash, callback) {
				var userId = (user.login === login && user.passwordHash === passwordHash)
					? user.id
					: null
				callback(userId);
			}
		}

		return demoUserManager;
	};

	exports.DemoUserManager = DemoUserManager();
})();

