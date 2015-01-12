(function() {

	var me = this;

	var c = {
		select: {
			workoutIdHolder: '#workoutId',
			editNumberOfSetsButton: '#editNumberOfSets',
			numberOfSetsInput: '#numberOfSets',
			startPauseWorkoutButton: '#startPauseWorkout',
			saveWorkoutButton: "#saveWorkout",
			beforeUnloadMsgInput: "#beforeUnloadMsg"
		},
		url: {
			loadWorkoutTemplate: '/data/workouts/{id}',
			saveWorkoutTemplate: '/data/workouts/{id}',
			workoutList: './..'
		},
		attr: {
			setRelaxButton: 'data-set-relax-button',
			audioPlayerId: 'audioPlayer'
		},
		set: {
			state: {
				blocked: 1,
				started: 2,
				relaxing: 3,
				finished: 4
			}
		}
	};
	c.select.setRelaxButtons = 'button[' + c.attr.setRelaxButton + ']';

	me.model = null;
	me.workoutId = null;
	me.workoutProgressInterval = null;
	me.setProgressInterval = null;
	me.audioPlayer = null;
	me.beforeUnloadMsg = null;
	me.documentTitle = document.title;

	function runScript(){
		$(document).ready(function(){
			workoutId = $(c.select.workoutIdHolder).val();
			model = new WorkoutRunPageViewModel()

			ko.bindingHandlers.momentjsWorkoutDateCalendar = {
				update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
					var value = valueAccessor();
					var allBindings = allBindingsAccessor();
					var valueUnwrapped = ko.utils.unwrapObservable(value);

					var locale = allBindings.locale || 'en';
					var output = allBindings.zeroValue || '-';
					if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0 && (new Date(valueUnwrapped)) > (new Date(0))) {
						output = moment(valueUnwrapped).locale(locale).calendar();
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
					var intValueUnwrapped = parseInt(valueUnwrapped, 10);
					if (!isNaN(intValueUnwrapped)) {
						output = moment.duration(intValueUnwrapped, 'minutes').locale(locale).humanize();
					}

					if ($(element).is("input") === true) {
						$(element).val(output);
					} else {
						$(element).text(output);
					}
				}
			};

			ko.applyBindings(model);
			model.loadWorkout(workoutId);
			me.audioPlayer = document.getElementById(c.attr.audioPlayerId);
			me.beforeUnloadMsg = $(c.select.beforeUnloadMsgInput).val();

			$("body")
				.on('click', c.select.editNumberOfSetsButton, onEditNumberOfSetsButtonClick)
				.on('click', c.select.startPauseWorkoutButton, onStartPauseWorkoutButtonClick)
				.on('click', c.select.setRelaxButtons, onSetRelaxButtonClick)
				.on('click', c.select.saveWorkoutButton, onSaveWorkoutButtonClick);
		});
	}

	/*
	 * Event handlers
	 */

	function onEditNumberOfSetsButtonClick(event) {
		me.model.editNumberOfSetsEnabled(!me.model.editNumberOfSetsEnabled());
	}

	function onStartPauseWorkoutButtonClick(event) {
		startPauseWorkout(!me.model.inProgress());
	}

	function onSetRelaxButtonClick(event) {
		var $button = $(event.currentTarget);
		var index = parseInt($button.attr(c.attr.setRelaxButton), 10);
		startSetRelaxing(index);
	}

	function onSaveWorkoutButtonClick(event) {
		var m = me.model.getWriteModel();
		var url = c.url.loadWorkoutTemplate.replace('{id}', me.workoutId);
		$.ajax({
	        'type': 'POST',
	        'url': url,
	        'contentType': 'application/json',
	        'data': JSON.stringify(m),
	        'dataType': 'json',
	        'success': function(data) {
	        	window.location.href = c.url.workoutList;
	        }
    	});
	}

	/*
	 * Private methods
	 */

	function startPauseWorkout(start) {
		if (me.model.inProgress() === start) {
			return;
		}

		me.model.inProgress(start);

		if (start) {
			pageClosingPrevent();

			// start timer
			me.workoutProgressInterval = setInterval(function() {
				var time = new Date(me.model.actualTime());
				time.setMilliseconds(time.getMilliseconds() + 1000);
				me.model.actualTime(time);
			}, 1000);

			// make first set 'started' if all sets were blocked
			var hasUnblockedSets = false;
			me.model.sets().map(function(s){
				hasUnblockedSets = hasUnblockedSets || s.state() > c.set.state.blocked;
			});
			if (!hasUnblockedSets) {
				me.model.sets()[0].state(c.set.state.started);
			}
		} else {
			pageClosingAllow();

			// stop timer
			clearInterval(me.workoutProgressInterval);
		}
	}

	function startSetRelaxing(index) {
		if (me.model.sets()[index].state() !== c.set.state.started)
			return;

		me.model.sets()[index].state(c.set.state.relaxing);
		var zeroDate = new Date(0);

		me.setProgressInterval = setInterval(function() {
			var time = new Date(me.model.sets()[index].actualTime());

			if (time <= zeroDate) {
				// stop set timer
				clearInterval(me.setProgressInterval);

				// play ding
				me.audioPlayer.play();

				// update state of current set to 'finished'
				me.model.sets()[index].state(c.set.state.finished);

				if (index < me.model.sets().length - 1) {
					// update state of the next set to 'started'
					me.model.sets()[index + 1].state(c.set.state.started);
				} else {
					// stop workout timer
					startPauseWorkout(false);
				}
				document.title = me.documentTitle;
			}
			else
			{
				time.setMilliseconds(time.getMilliseconds() - 1000);
				me.model.sets()[index].actualTime(time);
				document.title = getFormattedTime(time);
			}
		}, 1000);
	}

	function pageClosingPrevent() {
		window.onbeforeunload = onBeforeUnload;
	}

	function pageClosingAllow() {
		window.onbeforeunload = undefined;
	}

	function onBeforeUnload() {
		event = event || window.event;
		// For IE and Firefox
		if (event)
			event.returnValue = me.beforeUnloadMsg;
		// For Safari
		return me.beforeUnloadMsg;
	}

	/*
	 * View models
	 */

	function getFormattedTime(date){
		if (typeof date === 'undefined') {
			return '';
		}
		var ss = date.getSeconds();
		var mm = date.getMinutes();
		var str = ((mm >= 10) ? mm : ('0' + mm)) + ':' + ((ss >= 10) ? ss : ('0' + ss));
		return str;
	}

	function WorkoutSetViewModel(o) {
		var self = this;
		self.expectedReps = ko.observable(o.expectedReps);
		self.actualReps = ko.observable(o.actualReps);
		self.relaxTime = ko.observable(o.relaxTime);
		self.state = ko.observable(	c.set.state.blocked);
		self.actualTime = ko.observable(new Date(self.relaxTime() * 1000));
		self.relaxTime.subscribe(function(newValue) {
			self.actualTime(new Date(newValue * 1000));
		});
		self.actualTimeFormatted = ko.computed(function(){
			return getFormattedTime(self.actualTime());
		});

		// relax button enable
		self.relaxButtonEnabled = ko.computed(function(){
			return self.state() === c.set.state.started;
		});
		// states
		self.isBlocked = ko.computed(function(){
			return self.state() === c.set.state.blocked;
		});
		self.isStarted = ko.computed(function(){
			return self.state() === c.set.state.started;
		});
		self.isRelaxing = ko.computed(function(){
			return self.state() === c.set.state.relaxing;
		});
		self.isFinished = ko.computed(function(){
			return self.state() === c.set.state.finished;
		});
	}

	function WorkoutRunPageViewModel() {
		var self = this;
		self.exerciseName = ko.observable();
		self.sets = ko.observableArray([]);
		self.date = ko.observable();
		self.dateBetween = ko.observable();
		self.dateFromNow = ko.observable();
		self.estimatedTime = ko.observable();
		self.notes = ko.observable();
		self.editNumberOfSetsEnabled = ko.observable();
		self.inProgress = ko.observable(false);
		self.actualTime = ko.observable(new Date(0));
		self.actualTimeSec = ko.computed({
			read: function() {
				return (self.actualTime() != null)
					? self.actualTime().getUTCHours() * 24 * 60
						+ self.actualTime().getMinutes() * 60
						+ self.actualTime().getSeconds()
					: 0;
			},
			write: function(value) {
				var time = new Date(0);
				time.setSeconds(value);
				self.actualTime(time);
			}
		});
		self.setsStates = ko.observableArray([]);
		self.curStartDate = ko.observable((new Date()).toISOString().replace(/\.\d{3}/, ''));


		self.actualTimeFormatted = ko.computed(function(){
			return getFormattedTime(self.actualTime());
		});

		self.numberOfSets = ko.computed({
			read: function() {
				return self.sets().length;
			},
			write: function(value) {
				if (value < 0) {
					value = 0;
				}
				while(self.sets().length > value) {
					self.sets.pop();
				}
				while(self.sets().length < value) {
					var set = {
						expectedReps: 0,
						actualReps: 0,
						relaxTime: 0
					};

					if (self.sets().length > 0)
					{
						set.expectedReps = self.sets()[0].expectedReps();
						set.actualReps = self.sets()[0].actualReps();
						set.relaxTime = self.sets()[0].relaxTime();
					}

					self.sets.push(new WorkoutSetViewModel(set));
				}
			}
		});
	}

	WorkoutRunPageViewModel.prototype = {
		loadWorkout: function(id) {
			var self = this;
			var url = c.url.loadWorkoutTemplate.replace('{id}', id);
			$.get(
				url,
				function(data) {
					self.onLoadWorkout(data);
				},
				'json');
		},

		onLoadWorkout: function(data) {
			var self = this;
			self.exerciseName(data.exerciseName);
			self.date(data.date);
			self.dateBetween(data.dateBetween);
			self.dateFromNow(data.dateFromNow);
			self.notes(data.notes);
			self.estimatedTime(Math.floor(data.estimatedTime / 60));
			self.editNumberOfSetsEnabled(false);
			self.inProgress(false);
			self.actualTime(new Date(0));

			var mapping = {
				create: function(options) {
					return new WorkoutSetViewModel(options.data);
				}
			};

			ko.mapping.fromJS(data.sets, mapping, self.sets);
		},

		getWriteModel: function() {
			var m = {
				date: me.model.curStartDate(),
				notes: me.model.notes(),
				time:
					me.model.actualTime().getUTCHours() * 24 * 60
					+ me.model.actualTime().getMinutes() * 60
					+ me.model.actualTime().getSeconds(),
				sets: [],
				reps: 0
			};

			for (var i = 0; i < me.model.sets().length; i++) {
				m.sets.push({
					e: parseInt(me.model.sets()[i].expectedReps(), 10),
					a: parseInt(me.model.sets()[i].actualReps(), 10),
					r: me.model.sets()[i].relaxTime()
				});
				m.reps = m.reps + parseInt(me.model.sets()[i].actualReps(), 10);
			}

			return m;
		}
	};

	runScript();
})();