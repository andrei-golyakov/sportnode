(function(){
	var moment = require('moment');

	moment.locale('ru');

	var STATUS_BAD = 'bad';
	var STATUS_WARNING = 'warning';
	var STATUS_GOOD = 'good';

	function WorkoutSet(expectedReps, actualReps, relaxTime) {
		this.expectedReps = expectedReps;
		this.actualReps = actualReps;
		this.relaxTime = relaxTime;
	}

	function Workout(o) {
		var DAYS_FOR_WARNING = 1;

		var dateStatus = STATUS_BAD;
		if (o.date > (new Date(0))) {
			var nowMoment = moment();
			var warningMoment = moment(o.date).add(o.dateBetween, 'days').endOf('day');
			var badMoment =  moment(o.date).add(o.dateBetween + DAYS_FOR_WARNING, 'days').endOf('day');
			if (nowMoment.isBefore(warningMoment)) {
				dateStatus = STATUS_GOOD;
			} else if (nowMoment.isBefore(badMoment)) {
				dateStatus = STATUS_WARNING;
			}
		}

		this.id = o.id;
		this.exerciseName = o.exerciseName || '';
		this.sets = o.sets || [];
		this.date = o.date;
		this.dateBetween = o.dateBetween;
		this.dateFromNow = o.date;
		this.estimatedTime = o.estimatedTime;
		this.notes = o.notes;
		this.dateStatus = dateStatus;
	}
	
	function sortFunction (a, b){
		if (a.dateStatus === STATUS_BAD) {
			if (b.dateStatus === STATUS_WARNING || b.dateStatus === STATUS_GOOD){
				return -1;
			}
		} else if (a.dateStatus === STATUS_GOOD) {
			if (b.dateStatus === STATUS_BAD || b.dateStatus === STATUS_WARNING){
				return 1;
			}
		} else if (a.dateStatus === STATUS_WARNING) {
			if (b.dateStatus === STATUS_GOOD){
				return -1;
			} else if (b.dateStatus === STATUS_BAD) {
				return 1;
			}
		}
		
		return a.dateBetween - b.dateBetween;
	}
	
	Workout.sortFunction = sortFunction;
	
	exports.Workout = Workout;
	exports.WorkoutSet = WorkoutSet;
})();
