(function(){
	var UserManager = require('./mssqlUserManager').MSSQLUserManager;

	function UserManagerFactory() {
		this.createUserManager = function() {
			return new UserManager();
		};
	}

	exports.UserManagerFactory = new UserManagerFactory();
})();
