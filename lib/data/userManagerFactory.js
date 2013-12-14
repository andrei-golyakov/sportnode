(function(){
	//var UserManager = require('./demoUserManager').DemoUserManager;
	var UserManager = require('./awsDynamoDbUserManager').AwsDynamoDbUserManager;

	function UserManagerFactory() {
		this.createUserManager = function() {
			return new UserManager();
		};
	}
	
	exports.UserManagerFactory = new UserManagerFactory();
})();