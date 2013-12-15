var routes = require('./handlers');
var workout = require('./handlers/workout');

exports.routes = function(app) {
	app.get('/', routes.index);
	app.get('/logout', routes.logout);

	app.get('/workouts', workout.index);
	app.get('/workouts/run/:id', workout.run);

	app.get('/data/workouts', workout.data.getList);
	app.get('/data/workouts/:id', workout.data.getLatest);
	app.post('/data/workouts/:id', workout.data.updateLatest);
};
