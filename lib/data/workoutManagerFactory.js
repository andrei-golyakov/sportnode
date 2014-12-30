(function(){
	var  WorkoutManager = require('./mssqlWorkoutManager').MSSQLWorkoutManager;

	function WorkoutManagerFactory() {
		this.createWorkoutManager = function() {
			return new WorkoutManager();
		};
	}

	exports.WorkoutManagerFactory = new WorkoutManagerFactory();
})();
