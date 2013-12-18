/*
 * Implementation of UserManager.
 * 
 * Used tables:
 *
 * ThirdPartyUser
 *  (Hash key) ServiceUserId [String]: third-party service code and third-party service id concatinated with '#' char,
 *  UserId [String]: user identifier.
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

			resolveUserId: function(thirdPartyId, callback) {
				this.awsGetUserId(thirdPartyId, callback);
			},

			/*
			 * Private methods for resolveUserId
			 */

			awsGetUserId: function(thirdPartyId, callback) {
				var self = this;
				var q = {
					TableName: 'ThirdPartyUser',
					AttributesToGet: ['UserId'],
					Key: { 'ServiceUserId': { S: thirdPartyId } }
				};

				dynamodb.getItem(q, function(error, answer) {
					if (error) {
						callback(null, 'AWS getItem error: ' + error);
					} else {
						if (typeof answer.Item !== 'undefined' && answer.Item !== null) {
							callback(answer.Item.UserId.S, null);
						} else {
							self.awsSetUserId(thirdPartyId, callback);
						}
					}
				});
			},

			awsSetUserId: function(thirdPartyId, callback) {
				var q = {
					TableName: 'ThirdPartyUser',
					Item: {
						'ServiceUserId': { S: thirdPartyId },
						'UserId' : { S: commonHelper.newGuid() }
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
