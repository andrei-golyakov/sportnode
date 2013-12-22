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
	me.exerciseMap = {};

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
		var arrId = me.exerciseMap[eId];
		var exercise = me.model.exercises()[arrId];
		me.model.exerciseDialogMode(c.dialogMode.edit);
		me.model.exerciseDialogId(eId);
		me.model.exerciseDialogName(exercise.name());
		me.model.exerciseDialogPeriod(exercise.period());
		$(c.select.exerciseDialog).modal('show');
	}

	function onSaveExerciseDialog() {
		var eId = me.model.exerciseDialogId();
		var arrId = me.exerciseMap[eId];
		if (typeof arrId !== 'undefined' && arrId !== null) {
			var exercise = me.model.exercises()[arrId];
			exercise.name(me.model.exerciseDialogName());
			exercise.period(me.model.exerciseDialogPeriod());
		} else {
			me.model.exercises.push({
				id: ko.observable(eId),
				name: ko.observable(me.model.exerciseDialogName()),
				period: ko.observable(me.model.exerciseDialogPeriod())
			});
			me.model.exercises.sort(sortExercisesFunction);
			me.model.recalcExerciseMap();
		}

		$(c.select.exerciseDialog).modal('hide');
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
		console.log(a.name())
		if (a.name() < b.name()) {
			return -1;
		} else if (a.name() > b.name()) {
			return 1;
		} else {
			return 0;
		}
	}

	function ExerciseListPageViewModel() {
		var self = this;
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
			var len = me.model.exercises().length;
			me.exerciseMap = [];
			for (var i = 0; i < len; i++) {
				me.exerciseMap[me.model.exercises()[i].id()] = i;
			};
		}
	};
	
	runScript();
})();