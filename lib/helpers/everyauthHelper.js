var path = require('path');
var fs = require('fs');
var userManagerFactory = require('../data/userManagerFactory').UserManagerFactory;
var userManager = userManagerFactory.createUserManager();

var usersById = {};

function everyauthSetup(everyauth) {
	everyauth.debug = true;

	var conf = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/auth.json')));
	everyauth.everymodule.findUserById( function (id, callback) {
		callback(null, usersById[id]);
	});

	everyauth.facebook
		.appId(conf.fb.appId)
		.appSecret(conf.fb.appSecret)
		.fields('id,name,email,picture')
		.findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
			var promise = this.Promise();
			userManager.resolveUserId('fb#' + fbUserMetadata.id, function(userId, err){
				if (err) {
					promise.fail(err);
				} else {
					if (userId) {
						var user = {
							id: userId,
							name: fbUserMetadata.name,
							pictureUrl: fbUserMetadata.picture.data.url,
							service: 'fb',
							serviceId: fbUserMetadata.id
						};
						usersById[userId] = user;
						promise.fulfill(user);
					} else {
						// create a new record for new account
					}
				}
			});
			return promise;
		})
		.redirectPath('/');
}

exports.setup = everyauthSetup;
