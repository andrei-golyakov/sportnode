(function() {
	var me = this;

	var c = {
		select: {
			exercisesBlock: '#exercise-list',
			editExercise: 'tr[data-edit-exercise]',
			addExercise: 'button[data-add-exercise]',
			exerciseDialog: '#exerciseDialog',
			exerciseDialogSave: '#exerciseDialogSave'
		},
		attr: {
			editExerciseId: 'data-edit-exercise',
			dialogTitleAdd: 'data-dialog-title-add',
			dialogTitleEdit: 'data-dialog-title-edit',
		},
		url: {
			loadExercises: '/data/exercises',
			putExercise: '/data/exercises/put',
			deleteExercise: '/data/exercises/delete'
		},
		dialogMode: {
			add: 'add',
			edit: 'edit'
		}
	};

	me.model = null;

	function runScript(){
		$(document).ready(function() {
			me.model = new ExerciseListPageViewModel()
			ko.applyBindings(me.model);
			me.model.loadExercises();

			$("body")
				.on('click', c.select.editExercise, onEditExerciseClick)
				.on('click', c.select.addExercise, onAddExerciseClick)
				.on('hidden.bs.modal', c.select.exerciseDialog, onCloseExerciseDialog)
				.on('click', c.select.exerciseDialogSave, onSaveExerciseDialog)
		});
	}

	/*
	 * Event handlers
	 */

	function onAddExerciseClick(event) {
		var eId = newGuid();
		me.model.exerciseDialogMode(c.dialogMode.add);
		me.model.exerciseDialogId(eId);
		me.model.exerciseDialogName('');
		me.model.exerciseDialogPeriod('');
		$(c.select.exerciseDialog).modal('show');
	}

	function onEditExerciseClick(event) {
		var eId = $(event.currentTarget).attr(c.attr.editExerciseId);
		
		var exercise = me.model.getExerciseById(eId);
		if (typeof exercise !== 'undefined' && exercise !== null) {
			me.model.exerciseDialogMode(c.dialogMode.edit);
			me.model.exerciseDialogId(eId);
			me.model.exerciseDialogName(exercise.name());
			me.model.exerciseDialogPeriod(exercise.period());
			$(c.select.exerciseDialog).modal('show');
		} else {
			console.error('Exercise not found by ID specified.')
		}
	}

	function onSaveExerciseDialog() {
		var eId = me.model.exerciseDialogId();
		
		var exercise = me.model.getExerciseById(eId);
		if (typeof exercise !== 'undefined' && exercise !== null) {
			exercise.name(me.model.exerciseDialogName());
			exercise.period(me.model.exerciseDialogPeriod());
		} else {
			exercise = {
				id: ko.observable(eId),
				name: ko.observable(me.model.exerciseDialogName()),
				period: ko.observable(me.model.exerciseDialogPeriod())
			};
			me.model.exercises.push(exercise);
			me.model.exercises.sort(sortExercisesFunction);
			me.model.recalcExerciseMap();
		}

		$(c.select.exerciseDialog).modal('hide');
		weiteExercise(eId);
	}

	function onCloseExerciseDialog() {
		me.model.exerciseDialogMode('');
		me.model.exerciseDialogId('');
		me.model.exerciseDialogName('');
		me.model.exerciseDialogPeriod('');
	}

	/*
	 * Private methods
	 */

	function newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}

	function sortExercisesFunction (a, b){
		if (a.name() < b.name()) {
			return -1;
		} else if (a.name() > b.name()) {
			return 1;
		} else {
			return 0;
		}
	}

	function weiteExercise(id) {
		var m = me.model.getWriteModel(id);
		if (typeof m === 'undefined' || m === null) {
			console.error('Cannot get write model by ID specified.');
			return;
		}
		$.post(
			c.url.putExercise,
			m,
			function(data) {},
			'json'
		);
	}

	/*
	 * View model
	 */

	function ExerciseListPageViewModel() {
		var self = this;
		self.exerciseMap = [];
		self.exercises = ko.observableArray([]);
		self.exerciseDialogMode = ko.observable();
		self.exerciseDialogTitle = ko.computed(function() {
			if(self.exerciseDialogMode() === c.dialogMode.add) {
				return $(c.select.exerciseDialog).attr(c.attr.dialogTitleAdd);
			} else if (self.exerciseDialogMode() === c.dialogMode.edit) {
				return $(c.select.exerciseDialog).attr(c.attr.dialogTitleEdit);
			}
		});
		self.exerciseDialogId = ko.observable();
		self.exerciseDialogName = ko.observable();
		self.exerciseDialogPeriod = ko.observable();
	}

	ExerciseListPageViewModel.prototype = {
		loadExercises: function() {
			var self = this;
			var url = c.url.loadExercises;
			$.get(
				url,
				function(data) {
					self.onLoadExerciseList.call(self, data);
				},
				'json');
		},

		onLoadExerciseList: function(data) {
			var self = this;
			ko.mapping.fromJS(data, {}, self.exercises);
			self.exercises.sort(sortExercisesFunction);
			self.recalcExerciseMap();
		},

		recalcExerciseMap: function() {
			var self = this;
			var len = me.model.exercises().length;
			self.exerciseMap = [];
			for (var i = 0; i < len; i++) {
				self.exerciseMap[me.model.exercises()[i].id()] = i;
			};
		},

		getExerciseById: function(id) {
			var self = this;
			var arrId = self.exerciseMap[id];
			if (typeof arrId !== 'undefined' && arrId !== null) {
				return self.exercises()[arrId];
			}

			return undefined;
		},

		getWriteModel: function(id) {
			var self = this;
			var exercise = self.getExerciseById(id);
			if (typeof exercise !== 'undefined' && exercise !== null) {
				return {
					id: exercise.id(),
					name: exercise.name(),
					period: parseInt(exercise.period())
				}
			} else {
				return undefined;
			}
		}
	};
	
	runScript();
})();