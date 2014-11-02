/*
 * Implementation of UserManager.
 * 
 * Used for test with file from config: './config/user.json'.
 *
 * Format:
 * {
 * 	id: GUIDXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 * }
 */

(function(){
	var fs = require('fs');
	var path = require('path');

	function DemoUserManager() {


		function userManager() {}

		userManager.prototype = {
			/*
			 * Public methods (UserManager implementation).
			 */

			resolveUserId: function(thirdPartyId, callback) {
				this.demoGetUserId(thirdPartyId, callback);
			},

			/*
			 * Private methods for resolveUserId
			 */

			demoGetUserId: function(thirdPartyId, callback) {
				var user = null;
				var fname = './config/user.json';
				fs.exists(fname, function(exists) {
					if (exists) {
						fs.readFile(fname, function (error, data) {
							user = JSON.parse(data);
							callback(user.id, null);
						});
					} else {
						console.error('Config file "' + fname + '" absent!');
					}
				});
			}
		}

		return userManager;
	};

	exports.DemoUserManager = DemoUserManager();
})();
