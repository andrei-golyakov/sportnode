var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();
var ensureLanguage = require("../lib/helpers/routingLanguageHelper").ensureLanguage;;
var securityHelper = require("../lib/helpers/securityHelper");
var ensureUserLoggedIn = securityHelper.ensureUserLoggedIn;
var ensureUserLoggedInAjax = securityHelper.ensureUserLoggedInAjax;

/*
 * GET workouts index page.
 */

exports.index = function(req, res) {
	if (!ensureLanguage(req, res) || !ensureUserLoggedIn(req, res)) {
		return;
	}
	res.render('workout', {
		page: 'Workouts',
		locale: req.locale
	});
};

/*
 * GET single workout.
 */

exports.run = function(req, res) {
	if (!ensureLanguage(req, res) || !ensureUserLoggedIn(req, res)) {
		return;
	}
	res.render('workoutRun', {
		page: 'Workouts',
		id: req.params.id,
		locale: req.locale
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
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}
		workoutManager.getWorkouts(req.user.id, function(workouts, error){
			if(error) {
				console.log(error);
			}

			res.send(workouts);
		});
	},

	/*
	 * GET latest workout.
	 */

	getLatest: function(req, res) {
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}

		workoutManager.getWorkout(req.user.id, req.params.id, function(workout, error) {
			if(error) {
				console.log(error);
			}

			res.send(workout);
		});
	},

	/*
	 * POST latest workout.
	 */

	updateLatest: function(req, res) {
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}
		workoutManager.updateLatestWorkout(req.user.id, req.params.id, req.body, function(result, error) {
			if(error) {
				console.log(error);
			}
			res.send(result);
		});
	}
};
