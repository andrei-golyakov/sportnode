var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();
var ensureLanguage = require("../lib/helpers/routingLanguageHelper").ensureLanguage;
var securityHelper = require("../lib/helpers/securityHelper");
var ensureUserLoggedIn = securityHelper.ensureUserLoggedIn;
var ensureUserLoggedInAjax = securityHelper.ensureUserLoggedInAjax;

/*
 * GET exercises index page.
 */

exports.index = function(req, res) {
	if (!ensureLanguage(req, res) || !ensureUserLoggedIn(req, res)) {
		return;
	}
	res.render('exercise', {
		page: 'Exercises',
		locale: req.locale
	});
};

/*
 * Data methods.
 */

exports.data = {
	
	/*
	 * GET list of exercises.
	 */

	getList: function(req, res) {
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}
		workoutManager.getExercises(req.user.id, function(exercises){
			res.send(exercises);
		});
	},

	/*
	 * POST update of exercise
	 */

	put: function(req, res) {
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}
		workoutManager.putExercise(req.user.id, req.body, function(result){
			res.send(result);
		});
	},

	/*
	 * POST delete of exercise
	 */

	delete: function(req, res) {
		if (!ensureUserLoggedInAjax(req, res)) {
			return;
		}
		console.log('deleteItem: ' + req.body.id);
		// workoutManager.deleteExercise(req.user.id, req.body.id, function(exercises){
		// 	res.send(exercises);
		// });
	}
};
