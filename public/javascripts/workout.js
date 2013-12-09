(function() {

	var c = {
		select: {
			workoutListBlock: '#workout-list'
		},
		attr: {
		},
		url: {
			loadWorkoutListUrl: '/data/workouts'
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
			var url = c.url.loadWorkoutListUrl;
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