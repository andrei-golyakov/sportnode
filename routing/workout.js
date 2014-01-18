var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();
var ensureLanguage = require("./languageChecker").ensureLanguage;

/*
 * GET workouts index page.
 */

exports.index = function(req, res) {
	ensureLanguage(req, res);
	if (req.user) {
		res.render('workout', {
			page: 'Workouts'
		});
	} else {
		res.redirect('/');
	}
};

/*
 * GET single workout.
 */

exports.run = function(req, res) {
	ensureLanguage(req, res);
	if (req.user) {
		res.render('workoutRun', {
			page: 'Workouts',
			id: req.params.id
		});
	} else {
		res.redirect('/');
	}
};

/*
 * Data methods.
 */

exports.data = {
	/*
	 * GET list of workouts.
	 */

	getList: function(req, res) {
		if (req.user) {
			workoutManager.getWorkouts(req.user.id, function(workouts){
				res.send(workouts);
			});
		} else {
			res.send(401).end();
		}
	},

	/*
	 * GET latest workout.
	 */
	
	getLatest: function(req, res) {
		if (req.user) {
			workoutManager.getWorkout(req.user.id, req.params.id, function(workout) {
				res.send(workout);
			});
		} else {
			res.send(401).end();
		}
	},

	/*
	 * POST latest workout.
	 */

	updateLatest: function(req, res) {
		if (req.user) {
			workoutManager.updateLatestWorkout(req.user.id, req.params.id, req.body, function(result) {
				res.send(result);
			})
		} else {
			res.send(401).end();
		}
	}
};
