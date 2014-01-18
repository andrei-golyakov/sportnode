var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();
var ensureLanguage = require("./languageChecker").ensureLanguage;

/*
 * GET exercises index page.
 */

exports.index = function(req, res) {
	ensureLanguage(req, res);
	if (req.user) {
		res.render('exercise', {
			page: 'Exercises'
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
	 * GET list of exercises.
	 */

	getList: function(req, res) {
		if (req.user) {
			workoutManager.getExercises(req.user.id, function(exercises){
				res.send(exercises);
			});
		} else {
			res.send(401).end();
		}
	},

	/*
	 * POST update of exercise
	 */

	put: function(req, res) {
		if (req.user) {
			workoutManager.putExercise(req.user.id, req.body, function(result){
				res.send(result);
			});
		} else {
			res.send(401).end();
		}
	},

	/*
	 * POST delete of exercise
	 */

	delete: function(req, res) {
		if (req.user) {
			console.log('deleteItem: ' + req.body.id);
			// workoutManager.deleteExercise(req.user.id, req.body.id, function(exercises){
			// 	res.send(exercises);
			// });
		} else {
			res.send(401).end();
		}
	}
};
