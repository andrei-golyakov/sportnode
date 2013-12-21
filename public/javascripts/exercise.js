(function() {

	var c = {
		select: {
			exerciseListBlock: '#exercise-list'
		},
		attr: {
		},
		url: {
			loadExerciseList: '/data/exercises',
			putExercise: '/data/exercises/put',
			deleteExercise: '/data/exercises/delete'
		}
	};

	function runScript(){
		$(document).ready(function() {
			var pageModel = new ExerciseListPageViewModel()
			ko.applyBindings(pageModel);
			pageModel.loadExerciseList();
		});
	}

	function ExerciseListPageViewModel() {
		var self = this;
		self.exerciseList = ko.observableArray([]);
	}

	ExerciseListPageViewModel.prototype = {
		loadExerciseList: function() {
			var self = this;
			var url = c.url.loadExerciseList;
			$.get(
				url,
				function(data) {
					self.onLoadExerciseList.call(self, data);
				},
				'json');
		},

		onLoadExerciseList: function(data) {
			var self = this;
			ko.mapping.fromJS(data, {}, self.exerciseList);
		}
	};
	
	runScript();
})();