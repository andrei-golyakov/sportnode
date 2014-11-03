(function () {
	var c = {
		select: {
			workoutListBlock: '#workout-list'
		},
		attr: {},
		url: {
			loadWorkoutList: '/data/workouts'
		}
	};

	function runScript() {
		$(document).ready(function () {
			var pageModel = new WorkoutListPageViewModel();

			ko.bindingHandlers.momentjsWorkoutDateFromNow = {
				update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
					var value = valueAccessor();
					var allBindings = allBindingsAccessor();
					var valueUnwrapped = ko.utils.unwrapObservable(value);

					var locale = allBindings.locale || 'en';
					var output = allBindings.zeroValue || '-';
					if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0 && (new Date(valueUnwrapped)) > (new Date(0))) {
						output = moment(valueUnwrapped).locale(locale).fromNow();
					}

					if ($(element).is("input") === true) {
						$(element).val(output);
					} else {
						$(element).text(output);
					}
				}
			};
			ko.bindingHandlers.momentjsWiorkoutPeriod = {
				update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
					var value = valueAccessor();
					var allBindings = allBindingsAccessor();
					var valueUnwrapped = ko.utils.unwrapObservable(value);

					var locale = allBindings.locale || 'en';
					var output = '-';
					var intValueUnwrapped = parseInt(valueUnwrapped);
					if (!isNaN(intValueUnwrapped)) {
						output = moment.duration(intValueUnwrapped, 'seconds').locale(locale).humanize();
					}

					if ($(element).is("input") === true) {
						$(element).val(output);
					} else {
						$(element).text(output);
					}
				}
			};

			ko.applyBindings(pageModel);
			pageModel.loadWorkoutList();
		});

		// facebook auth hash fix
		if (window.location.hash && window.location.hash == '#_=_') {
			if (window.history && history.pushState) {
				window.history.pushState("", document.title, window.location.pathname);
			} else {
				// Prevent scrolling by storing the page's current scroll offset
				var scroll = {
					top: document.body.scrollTop,
					left: document.body.scrollLeft
				};
				window.location.hash = '';
				// Restore the scroll offset, should be flicker free
				document.body.scrollTop = scroll.top;
				document.body.scrollLeft = scroll.left;
			}
		}
	}

	function WorkoutListPageViewModel() {
		var self = this;
		self.workoutList = ko.observableArray([]);
	}

	WorkoutListPageViewModel.prototype = {
		loadWorkoutList: function () {
			var self = this;
			var url = c.url.loadWorkoutList;
			$.get(
				url,
				function (data) {
					self.onLoadWorkoutList.call(self, data);
				},
				'json');
		},

		onLoadWorkoutList: function (data) {
			var self = this;
			ko.mapping.fromJS(data, {}, self.workoutList);
		}
	};

	runScript();
})();