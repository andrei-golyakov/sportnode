var tm = require('../lib/helpers/translationManager');
var workoutManagerFactory = require('../lib/data/workoutManagerFactory').WorkoutManagerFactory;
var workoutManager = workoutManagerFactory.createWorkoutManager();

/*
 * GET exercises index page.
 */

exports.index = function(req, res) {
	if (req.user) {
		res.render('exercise', {
			page: 'Exercises',
			lang: tm.translations(res, 'exercise')
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
			console.log('putItem: ' + req.body.id)
			// workoutManager.putExercise(req.user.id, req.body, function(exercises){
			// 	res.send(exercises);
			// });
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
