// outdated

(function(){
	var moment = require('moment');
	var workout = require('../model/workout');

	var Workout = workout.Workout;
	var WorkoutSet = workout.WorkoutSet;

	function DemoWorkoutManager(){
		var workouts = [
			new Workout({ 
				id: '1',
				exerciseName: 'Pushups',
				sets: [
					new WorkoutSet(10, 10, 10),
					new WorkoutSet(13, 11, 5),
					new WorkoutSet(10, 10, 5),
					new WorkoutSet(10, 10, 5),
					new WorkoutSet(15, 7, 5)
				],
				date: moment().add('days', -2).toDate(),
				dateBetween: 1,
				estimatedTime: 500,
				notes: 'Short notes example for Push-ups'
			}),
			new Workout({
				id: '2',
				exerciseName: 'Single Arm Front Shoulder Raise',
				sets: [
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(25, 17, 180)
				],
				date: moment().add('days', -5).toDate(),
				dateBetween: 2,
				estimatedTime: 600,
				notes: 'Short notes example for Rises'
			}),
			new Workout({
				id: '3',
				exerciseName: 'Overhand Pullups',
				sets: [
					new WorkoutSet(10, 10, 60),
					new WorkoutSet(13, 11, 60),
					new WorkoutSet(10, 10, 60),
					new WorkoutSet(10, 10, 60),
					new WorkoutSet(15, 7, 180)
				],
				date: moment().add('days', -1).toDate(),
				dateBetween: 4,
				estimatedTime: 700,
				notes: ''
			}),
			new Workout({
				id: '4',
				exerciseName: 'Deep Squats',
				sets: [
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(23, 21, 90),
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(25, 17, 180)
				],
				date: moment().add('days', -6).toDate(),
				dateBetween: 3,
				estimatedTime: 450,
				notes: 'weitgh: 1-2-3: 20 kg; 4-5: 15 kg'
			}),
			new Workout({
				id: '5',
				exerciseName: 'Crunch',
				sets: [
					new WorkoutSet(10, 10, 60),
					new WorkoutSet(13, 11, 60),
					new WorkoutSet(10, 10, 60),
				],
				date: moment().add('days', -2).toDate(),
				dateBetween: 1,
				estimatedTime: 600,
				notes: 'weitgh: 1-2: 5 kg'
			}),
			new Workout({
				id: '6',
				exerciseName: 'Single Arm Tricep Pullover',
				sets: [
					new WorkoutSet(20, 20, 90),
					new WorkoutSet(23, 21, 90),
					new WorkoutSet(25, 17, 180)
				],
				date: moment().add('days', -2).toDate(),
				dateBetween: 3,
				estimatedTime: 780,
				notes: ''
			})
		];
		
		workouts.sort(Workout.sortFunction);

		function demoWorkoutManager() {}

		demoWorkoutManager.prototype = {

			getWorkouts: function(userId, callback) {
				console.log("Get Workouts...");
				callback(workouts);
				console.log("Get done...");
			},

			getWorkout: function(userId, workoutId, callback) {
				for(var i = 0; i < workouts.length; i++) {
					if (workouts[i].id == workoutId) {
						callback(workouts[i]);
						return;
					}
				}
				
				callback(null);
			}
		};

		return demoWorkoutManager;
	};
	
	exports.DemoWorkoutManager = DemoWorkoutManager();
})();
