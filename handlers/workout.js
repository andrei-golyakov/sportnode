var tm = require('../lib/helpers/translationManager');
var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var userManagerFactory = require('../lib/data/userManagerFactory').UserManagerFactory;

var workoutManager = workoutManagerFactory.createWorkoutManager();
var userManager = userManagerFactory.createUserManager();

/*
 * GET workouts index page.
 */

exports.index = function(req, res) {
	userManager.getUser(req, function(user) {
		if (user) {
			res.render('workout', { 
				page: 'Workouts',
				lang: tm.translations(res, 'workout'),
				user: user
			});
		} else {
			res.redirect('/');
		}
	});
};

/*
 * GET single workout.
 */

exports.run = function(req, res) {
	userManager.getUser(req, function(user) {
		if (user) {
			res.render('workoutRun', {
				page: 'Workouts',
				lang: tm.translations(res, 'workoutRun'),
				user: user,
				id: req.params.id });
		} else {
			res.redirect('/');
		}
	});
};

/*
 * Data methods.
 */

exports.data = {
	/*
	 * GET list of workouts.
	 */

	getList: function(req, res) {
		userManager.getUser(req, function(user) {
			if (user) {
				workoutManager.getWorkouts(user.id, function(workouts){
					res.send(workouts);
				});
			} else {
				res.send(401).end();
			}
		});
	},

	/*
	 * GET latest workout.
	 */
	
	getLatest: function(req, res) {
		userManager.getUser(req, function(user) {
			if (user) {
				workoutManager.getWorkout(user.id, req.params.id, function(workout) {
					res.send(workout);
				});
			} else {
				res.send(401).end();
			}
		});
	},

	/*
	 * POST latest workout.
	 */

	updateLatest: function(req, res) {
		userManager.getUser(req, function(user) {
			if (user) {
				workoutManager.updateLatestWorkout(user.id, req.params.id, req.body, function(result) {
					res.send(result);
				})
			} else {
				res.send(401).end();
			}
		});
	}
};