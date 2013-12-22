(function() {

	var c = {
		select: {
			workoutListBlock: '#workout-list'
		},
		attr: {
		},
		url: {
			loadWorkoutList: '/data/workouts'
		}
	};

	function runScript(){
		$(document).ready(function() {
			var pageModel = new WorkoutListPageViewModel()
			ko.applyBindings(pageModel);
			pageModel.loadWorkoutList();
		});
	}

	function WorkoutListPageViewModel() {
		var self = this;
		self.workoutList = ko.observableArray([]);
	}

	WorkoutListPageViewModel.prototype = {
		loadWorkoutList: function() {
			var self = this;
			var url = c.url.loadWorkoutList;
			$.get(
				url,
				function(data) {
					self.onLoadWorkoutList.call(self, data);
				},
				'json');
		},

		onLoadWorkoutList: function(data) {
			var self = this;
			ko.mapping.fromJS(data, {}, self.workoutList);
		}
	};
	
	runScript();
})();