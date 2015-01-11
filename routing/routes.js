exports.setup = function() {
	var router = require('express').Router();
	var routes = require('./index');
	var workout = require('./workout');
	var exercise = require('./exercise');

	router.get('/', routes.index);
	router.get('/logout', routes.logout);

	router.get('/data/workouts', workout.data.getList);
	router.get('/data/workouts/:id', workout.data.getLatest);
	router.post('/data/workouts/:id', workout.data.updateLatest);

	router.get('/data/exercises', exercise.data.getList);
	router.post('/data/exercises/put', exercise.data.put);
	router.post('/data/exercises/delete', exercise.data.delete);

	router.get('/:lang/about', routes.about);
	router.get('/:lang/workouts', workout.index);
	router.get('/:lang/workouts/run/:id', workout.run);
	router.get('/:lang/exercises', exercise.index);
	router.get('/:lang', routes.index);

	return router;
};
