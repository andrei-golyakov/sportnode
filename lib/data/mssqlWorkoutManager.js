/*
 * Implementation of Workout Manager for Microsoft SQL Server.
 */

(function(){
	var commonHelper = require('../helpers/commonHelper');
	var fs = require('fs');
	var path = require('path');
	var sql = require('mssql');
	var fileConfig = fs.readFileSync(path.resolve(__dirname, '../../config/mssql.json'));
	var config = JSON.parse(fileConfig);


	var moment = require('moment');
	var workout = require('../model/workout');
	var exercise = require('../model/exercise');

	var Workout = workout.Workout;
	var WorkoutSet = workout.WorkoutSet;
	var Exercise = exercise.Exercise;

	function WorkoutManager(){

		function workoutManager() {}

		workoutManager.prototype = {

			/*
			 * Public methods (WorkoutManager implementation).
			 */

			getWorkouts: function(userId, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', userId);
						request.execute('[Commons].[GetLatestWorkouts]', function(error, recordsets) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							} else {
								var results = [];
								for (var i = recordsets[0].length; i--; ) {
									var r = recordsets[0][i];
									var o = new Workout({
										id: r.ExerciseId,
										exerciseName: r.Name,
										dateBetween: r.Period,
										date: r.Date,
										estimatedTime: r.TimeInSeconds || 0,
										notes: ''
									});
									results.push(o);
								}

								results.sort(Workout.sortFunction);
								callback(results, null);
							}
						});
					}
				});
			},

			getWorkout: function(userId, exerciseId, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', sql.UniqueIdentifier, userId);
						request.input('exerciseId', sql.UniqueIdentifier, exerciseId);
						request.execute('[Commons].[GetLatestWorkout]', function(error, recordsets) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							} else {
								var r = recordsets[0][0];
								var o = new Workout({
									id: exerciseId,
									exerciseName: r.Name,
									dateBetween: r.Period,
									date: r.Date || new Date(0),
									estimatedTime: r.TimeInSeconds || 0,
									notes: r.Notes
								});
								o.sets = [];
								if (typeof r.DataJson !== 'undefined' && r.DataJson !== null) {
									var ss = JSON.parse(r.DataJson);
									for (var i = 0; i < ss.length; i++) {
										o.sets.push(new WorkoutSet(ss[i].e, ss[i].a, ss[i].r));
									};
								}
								callback(o, null);
							}
						});
					}
				});
			},

			updateLatestWorkout: function(userId, exerciseId, data, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', userId);
						request.input('exerciseId', exerciseId);
						request.input('date', data.date);
						request.input('totalCount', data.reps);
						request.input('timeInSeconds', data.time);
						request.input('dataJson', JSON.stringify(data.sets));
						request.input('notes', data.notes);
						request.execute('[Commons].[SetLatestWorkout]', function(error) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							}
						});
					}
				});
			},

			getExercises: function(userId, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', userId);
						request.execute('[Commons].[GetExercises]', function(error, recordsets) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							} else {
								var results = [];
								for (var i = recordsets[0].length; i--; ) {
									var r = recordsets[0][i];
									var o = new Exercise({
										id: r.ExerciseId,
										name: r.Name,
										period: r.Period
									});
									results.push(o);
								}

								callback(results, null);
							}
						});
					}
				});
			},

			putExercise: function(userId, data, callback) {
				var connection = new sql.Connection(config, function(error) {
					if (error) {
						callback(null, 'MSSQL error: ' + error);
					} else {
						var request = new sql.Request(connection);
						request.input('userId', userId);
						request.input('exerciseId', data.id);
						request.input('name', data.name);
						request.input('period', data.period);
						request.execute('[Commons].[SetExercise]', function(error) {
							if (error) {
								callback(null, 'MSSQL error: ' + error);
							}
						});
					}
				});
			}
		};

		return workoutManager;
	}

	exports.MSSQLWorkoutManager = WorkoutManager();
})();
