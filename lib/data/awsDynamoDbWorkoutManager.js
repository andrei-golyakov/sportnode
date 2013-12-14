(function(){
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('./config/aws.json');
	var dynamodb = new AWS.DynamoDB();

	var moment = require('moment');
	var workout = require('../model/workout');

	var Workout = workout.Workout;
	var WorkoutSet = workout.WorkoutSet;

	function AwsDynamoDbWorkoutManager(){
		
		function demoWorkoutManager() {}

		demoWorkoutManager.prototype = {
			key: {
				exercisesDone: 'e',
				workoutsDone: 'w',
				error: 'err',
				items: 'items',
				latestWokroutDone: 'lw',
				workoutHistoryDone: 'wh'
			},

			/*
			 * Public methods (WorkoutManager implementation).
			 */

			getWorkouts: function(userId, callback) {
				var data = {};
				data[this.key.items] = {};
				this.awsGetExercises(userId, data, callback);
				this.awsGetLatestWorkouts(userId, data, callback);
			},

			getWorkout: function(userId, exerciseId, callback) {
				this.awsGetLatestWorkout(userId, exerciseId, callback);
			},

			putExercise: function(userId, exerciseId, data, callback) {
				// update Exercise table
			},

			updateLatestWorkout: function(userId, exerciseId, data, callback) {
				this.awsUpdateLatestWorkout(userId, exerciseId, data, callback);
			},

			/*
			 * Private methods for getWorkouts
			 */

			awsGetExercises: function(userId, data, callback) {
				var self = this;
				var q = {
					TableName: 'Exercise',
					AttributesToGet: ['ExerciseId', 'Nm', 'Pd'],
					KeyConditions: {
						'UserId': {
							AttributeValueList: [{S: userId}],
							ComparisonOperator: 'EQ'
						}
					}
				};

				dynamodb.query(q, function(error, answer) {
					if (error) {
						data[self.key.error] = 'AWS find error: ' + error;
					} else {
						for (var i = 0; i < answer.Count; i++) {
							var id = answer.Items[i].ExerciseId.S;
							data[self.key.items][id] = data[self.key.items][id] || {};
							data[self.key.items][id]['Name'] = answer.Items[i].Nm.S;
							data[self.key.items][id]['Period'] = parseInt(answer.Items[i].Pd.N);
						};
					}

					data[self.key.exercisesDone] = true;
					self.processLastWorkoutBase(data, callback);
				});
			},

			awsGetLatestWorkouts: function(userId, data, callback) {
				var self = this;
				var q = {
					TableName: 'LatestWorkout',
					AttributesToGet: ['ExerciseId', 'Dt', 'Tm'],
					KeyConditions: {
						'UserId': {
							AttributeValueList: [{S: userId}],
							ComparisonOperator: 'EQ'
						}
					}
				};

				dynamodb.query(q, function(error, answer) {
					if (error) {
						data[self.key.error] = 'AWS find error: ' + error;
						console.log(data[self.key.error]);
					} else {
						for (var i = 0; i < answer.Count; i++) {
							var id = answer.Items[i].ExerciseId.S;
							data[self.key.items][id] = data[self.key.items][id] || {};
							data[self.key.items][id]['Date'] = answer.Items[i].Dt.S;
							data[self.key.items][id]['Time'] = parseInt(answer.Items[i].Tm.N);
						};
					}

					data[self.key.workoutsDone] = true;
					self.processLastWorkoutBase(data, callback);
				});
			},

			processLastWorkoutBase: function(data, callback) {
				var self = this;
				if(!data[self.key.workoutsDone] || !data[self.key.exercisesDone]) {
					return; // waiting for both queries done
				}
				if (data[self.key.error]) {
					callback({ error: data[self.key.error] });
					return;
				}

				var results = [];
				for(var id in data.items) {
					var item = data.items[id];
					var o = new Workout({ 
						id: id,
						exerciseName: item.Name,
						dateBetween: item.Period,
						date: new Date(item.Date || 0),
						estimatedTime: item.Time || 0,
						notes: ''
					});
					results.push(o);
				};
				results.sort(Workout.sortFunction);
				callback(results);
			},

			/*
			 * Private methods for getWorkout.
			 */

			awsGetLatestWorkout: function(userId, exerciseId, callback) {
				var self = this;
				var keys = [{
					'UserId': {S: userId},
					'ExerciseId': {S: exerciseId}
				}];
				var query = {
					RequestItems : {
						Exercise: {
							Keys: keys,
							AttributesToGet: ['Nm', 'Pd']
						},
						LatestWorkout : {
							Keys: keys,
							AttributesToGet: ['Dt', 'Tm', 'St', 'Nt']
						}
					}
				};
				dynamodb.batchGetItem(query, function(error, answer) {
					if (error) {
						var msg = 'AWS find error: ' + error;
						console.log(msg);
						callback({ error: msg }); // return empty
					} else {
						var e = answer.Responses.Exercise[0];
						var o = new Workout({ 
							id: exerciseId,
							exerciseName: e.Nm.S,
							dateBetween: parseInt(e.Pd.N)
						});
						var w = answer.Responses.LatestWorkout[0];
						var ok = typeof w !== 'undefined' && w !== null;
						o.date = new Date((ok && typeof w.Dt !== 'undefined') ? w.Dt.S : 0);
						o.estimatedTime = (ok && typeof w.Tm !== 'undefined') ? parseInt(w.Tm.N) : 0;
						o.notes = (ok && typeof w.Nt !== 'undefined') ? w.Nt.S : '';
						o.sets = [];
						if (ok && typeof w.St !== 'undefined') {
							ss = JSON.parse(w.St.S);
							for (var i = 0; i < ss.length; i++) {
								o.sets.push(new WorkoutSet(ss[i].e, ss[i].a, ss[i].r));
							};
						}
						callback(o);
					}
				});
			},

			/*
			 * Private methods for updateWorkout
			 */

			awsUpdateLatestWorkout: function(userId, exerciseId, workout, callback) {
				var self = this;
				var dt = workout.date;
				var rp = workout.reps;
				var tm = workout.time;
				var st = JSON.stringify(workout.sets);
				var nt = workout.notes;

				var query = {
					RequestItems: {
						LatestWorkout: [{
							PutRequest: {
								Item: {
									'UserId': { S: userId },
									'ExerciseId': { S: exerciseId },
									'Dt': { S: dt },
									'Rp': { N: rp },
									'St': { S: st },
									'Tm': { N: tm },
									'Nt': { S: nt }
								}
							}
						}],
						WorkoutHistory: [{
							PutRequest: {
								Item: {
									'UserId': { S: userId },
									'Date_ExerciseId': { S: dt + '#' + exerciseId },
									'Rp': { N: rp },
									'St': { S: st },
									'Tm': { N: tm },
									'Nt': { S: nt }
								}
							}
						}]
					}
				};

				dynamodb.batchWriteItem(query, function(error, answer) {
					if (error) {
						var msg = 'AWS find error: ' + error;
						console.log(msg);
						callback({ error: msg }); // return empty
					} else {
						var o = answer;
						callback(o);
					}
				});
			}
		};

		return demoWorkoutManager;
	}

	exports.AwsDynamoDbWorkoutManager = AwsDynamoDbWorkoutManager();
})();