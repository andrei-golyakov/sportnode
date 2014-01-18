var path = require('path');
var fs = require('fs');
var userManagerFactory = require('../data/userManagerFactory').UserManagerFactory;
var userManager = userManagerFactory.createUserManager();

var usersById = {};

function everyauthSetup(everyauth) {
	var successRedirectUrl = '/workouts';

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
		.redirectPath(successRedirectUrl);

	everyauth.vkontakte
		.appId(conf.vk.appId)
		.appSecret(conf.vk.appSecret)
		.fields('photo')
		.scope('photos')
		.findOrCreateUser( function (session, accessToken, accessTokenExtra, vkUserMetadata) {
			var promise = this.Promise();
			userManager.resolveUserId('vk#' + vkUserMetadata.uid, function(userId, err){
				if (err) {
					promise.fail(err);
				} else {
					if (userId) {
						var user = {
							id: userId,
							name: vkUserMetadata.first_name + ' ' + vkUserMetadata.last_name,
							pictureUrl: vkUserMetadata.photo,
							service: 'vk',
							serviceId: vkUserMetadata.uid
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
		.redirectPath(successRedirectUrl);
}

exports.setup = everyauthSetup;
