/*
 * Implementation of UserManager.
 * 
 * Used tables:
 *
 * ThirdPartyUser
 *  (Hash key) ServiceUserId [String]: third-party service code and third-party service id concatinated with '#' char,
 *  UserId [String]: user identifier,
 *  Name [String]: user name,
 *  Dt [String]: date of the registration,
 *  Img [String]: image URL.
 */

(function(){
	var commonHelper = require('../helpers/commonHelper');
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('./config/aws.json');
	var dynamodb = new AWS.DynamoDB();

	function AwsDynamoDbUserManager(){
		
		function userManager() {}

		userManager.prototype = {
			/*
			 * Public methods (WorkoutManager implementation).
			 */

			getUser: function(thirdPartyUser, callback) {
				this.awsGetUserId(thirdPartyUser, callback);
			},

			createUser: function(thirdPartyUser, callback) {
				this.awsSetUserId(thirdPartyUser, callback)
			},

			/*
			 * Private methods for getUser and createUser
			 */

			awsGetUserId: function(thirdPartyUserId, callback) {
				var self = this;
				var q = {
					TableName: 'ThirdPartyUser',
					AttributesToGet: ['UserId'],
					Key: { 'ServiceUserId': { S: thirdPartyUserId } }
				};

				dynamodb.getItem(q, function(error, answer) {
					if (error) {
						callback(null, 'AWS getItem error: ' + error);
					} else {
						if (typeof answer.Item !== 'undefined' && answer.Item !== null) {
							callback(answer.Item.UserId.S, null);
						} else {
							callback(null, null);
						}
					}
				});
			},

			awsSetUserId: function(thirdPartyUser, callback) {
				var q = {
					TableName: 'ThirdPartyUser',
					Item: {
						'ServiceUserId': { S: thirdPartyUser.thirdPartyUserId },
						'UserId' : { S: commonHelper.newGuid() },
						'Name': { S: thirdPartyUser.name },
						'Img': {S: thirdPartyUser.img },
						'Dt': {S: thirdPartyUser.dt }
					}
				};

				dynamodb.putItem(q, function(error){
					if(error) {
						callback(null, 'AWS putItem error: ' + error);
					} else {
						callback(q.Item.UserId.S, null);
					}
				});
			}
		}

		return userManager;
	}

	exports.AwsDynamoDbUserManager = AwsDynamoDbUserManager();
})();
