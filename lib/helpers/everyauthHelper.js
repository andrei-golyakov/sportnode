var userManagerFactory = require('../data/userManagerFactory').UserManagerFactory;
var userManager = userManagerFactory.createUserManager();
var workoutManagerFactory = require('../data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();

var usersById = {};

function everyauthSetup(everyauth) {
	var successRedirectUrl = '/workouts';
	var conf = require('./config').config.auth;

	everyauth.everymodule.findUserById(function (id, callback) {
		callback(null, usersById[id]);
	});

	var demoExercises = [
		{
			id: '00000000-0000-0000-DE30-000000000001',
			name: 'Грудь, трицепс: отжимания от пола',
			period: "2"
		},
		{
			id: '00000000-0000-0000-DE30-000000000002',
			name: 'Спина, бицепс: подтагивания на турнике',
			period: "2"
		},
		{
			id: '00000000-0000-0000-DE30-000000000003',
			name: 'Ноги: приседания',
			period: "3"
		},
		{
			id: '00000000-0000-0000-DE30-000000000004',
			name: 'Пресс: скручивания лёжа на полу',
			period: "3"
		}];
	var demoWorkouts = [
		{
			date: (new Date(0)).toISOString(),
			reps: "50",
			time: "600",
			sets: [
				{
					"e": "15",
					"a": "15",
					"r": "90"
				},
				{
					"e": "15",
					"a": "14",
					"r": "90"
				},
				{
					"e": "15",
					"a": "13",
					"r": "90"
				},
				{
					"e": "15",
					"a": "10",
					"r": "120"
				}],
			notes: ''
		}];

	function getUserInternal(user, usersById, promise) {
		userManager.getUser(user.thirdPartyId, function (userId, err) {
			if (err) {
				promise.fail(err);
			} else {
				if (userId) {
					user.id = userId;
					usersById[userId] = user;
					promise.fulfill(user);
				} else {
					var dbUser = {
						thirdPartyUserId: user.thirdPartyId,
						name: user.name,
						img: user.pictureUrl,
						dt: (new Date()).toISOString()
					};
					userManager.createUser(dbUser, function (userId, err) {
						user.id = userId;
						usersById[userId] = user;
						promise.fulfill(user);

						// setup demo exercises
						var dummyFunc = function () {};
						for (var i = 0; i < demoExercises.length; i++) {
							workoutManager.putExercise(
								user.id,
								demoExercises[i],
								dummyFunc);
							workoutManager.updateLatestWorkout(
								user.id,
								demoExercises[i].id,
								demoWorkouts[0],
								dummyFunc);
						}
					});
				}
			}
		});
	}

	everyauth.facebook
		.appId(conf.fb.appId)
		.appSecret(conf.fb.appSecret)
		.fields('id,name,email,picture')
		.findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
			var promise = this.Promise();
			var user = {
				id: null,
				thirdPartyId: 'fb#' + fbUserMetadata.id,
				name: fbUserMetadata.name,
				pictureUrl: fbUserMetadata.picture.data.url,
				service: 'fb',
				serviceId: fbUserMetadata.id
			};
			getUserInternal(user, usersById, promise);
			return promise;
		})
		.redirectPath(successRedirectUrl);

	everyauth.vkontakte
		.appId(conf.vk.appId)
		.appSecret(conf.vk.appSecret)
		.fields('photo')
		.scope('photos')
		.findOrCreateUser(function (session, accessToken, accessTokenExtra, vkUserMetadata) {
			var promise = this.Promise();
			var user = {
				id: null,
				thirdPartyId: 'vk#' + vkUserMetadata.uid,
				name: vkUserMetadata.first_name + ' ' + vkUserMetadata.last_name,
				pictureUrl: vkUserMetadata.photo,
				service: 'vk',
				serviceId: vkUserMetadata.uid
			};
			getUserInternal(user, usersById, promise);
			return promise;
		})
		.redirectPath(successRedirectUrl);
}

exports.setup = everyauthSetup;