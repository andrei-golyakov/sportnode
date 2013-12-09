(function(){
	var UserManager = require('./demoUserManager').DemoUserManager;

	function UserManagerFactory() {
		this.createUserManager = function() {
			return new UserManager();
		};
	}
	
	exports.UserManagerFactory = new UserManagerFactory();
})();