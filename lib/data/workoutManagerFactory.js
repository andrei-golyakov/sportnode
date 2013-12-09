(function(){
	//var WorkoutManager = require('./demoWorkoutManager').DemoWorkoutManager;
	var WorkoutManager = require('./awsDynamoDbWorkoutManager').AwsDynamoDbWorkoutManager;
	
	function WorkoutManagerFactory() {
		this.createWorkoutManager = function() {
			return new WorkoutManager();
		};
	}
	
	exports.WorkoutManagerFactory = new WorkoutManagerFactory();
})();