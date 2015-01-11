/*
 * Implementation of UserManager for Microsoft SQL Server.
 */

(function(){
	var sql = require('mssql');
	var commonHelper = require('../helpers/commonHelper');
	var config = require('../helpers/config').config.mssql;

	function UserManager(){

		function userManager() {}

		userManager.prototype = {

			/*
			 * Public methods (WorkoutManager implementation).
			 */

			getUser: function(thirdPartyUserId, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('thirdPartyUserId', thirdPartyUserId);
						request.execute('[Commons].[GetUserId]', function(error, recordsets) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							} else {
								callback(recordsets[0][0].UserId, null);
							}
						});
					}
				});
			},

			createUser: function(thirdPartyUser, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', commonHelper.newGuid());
						request.input('thirdPartyUserId', thirdPartyUser.thirdPartyUserId);
						request.input('name', thirdPartyUser.name);
						request.input('imageUrl', thirdPartyUser.img);
						request.execute('[Commons].[SetUserId]', function(error) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							}
						});
					}
				});
			}
		};

		return userManager;
	}

	exports.MSSQLUserManager = UserManager();
})();
