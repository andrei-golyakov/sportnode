(function(){
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
						callback(null, 'AWS find error: ' + error);
					} else {
						if (typeof answer.Item !== 'undefined' || answer.Item !== null) {
							callback(answer.Item.UserId.S, null);
						} else {
							callback(null, null);
						}
					}
				});
			}
		}

		return userManager;
	}

	exports.AwsDynamoDbUserManager = AwsDynamoDbUserManager();
})();