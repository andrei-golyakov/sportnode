var routes = require('./handlers');
var workout = require('./handlers/workout');
var exercise = require('./handlers/exercise');
var i18n = require("i18n");

exports.routes = function(app) {
	app.get('/', routes.index);
	app.get('/logout', routes.logout);

	app.get('/data/workouts', workout.data.getList);
	app.get('/data/workouts/:id', workout.data.getLatest);
	app.post('/data/workouts/:id', workout.data.updateLatest);

	app.get('/data/exercises', exercise.data.getList);
	app.post('/data/exercises/put', exercise.data.put);
	app.post('/data/exercises/delete', exercise.data.delete);

	app.get('/:lang/about', routes.about);
	app.get('/:lang/workouts', workout.index);
	app.get('/:lang/workouts/run/:id', workout.run);
	app.get('/:lang/exercises', exercise.index);
	app.get('/:lang', routes.index);
};
