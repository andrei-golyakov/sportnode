(function(){
	var WorkoutManager = require('./awsDynamoDbWorkoutManager').AwsDynamoDbWorkoutManager;
	
	function WorkoutManagerFactory() {
		this.createWorkoutManager = function() {
			return new WorkoutManager();
		};
	}
	
	exports.WorkoutManagerFactory = new WorkoutManagerFactory();
})();
