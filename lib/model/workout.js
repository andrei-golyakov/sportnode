(function(){
	var moment = require('moment');

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

		var nowMoment = moment();
		var dateMoment = moment(o.date);
		var warningMoment = moment(o.date).add('days', o.dateBetween).endOf('day');
		var badMoment =  moment(o.date).add('days', o.dateBetween + DAYS_FOR_WARNING).endOf('day');

		this.id = o.id;
		this.exerciseName = o.exerciseName || '';
		this.sets = o.sets || [];
		this.date = o.date;
		this.dateBetween = o.dateBetween;
		this.dateFromNow = dateMoment.fromNow();
		this.estimatedTime = Math.floor(o.estimatedTime / 60);
		this.notes = o.notes;

		if (nowMoment.isBefore(warningMoment)) {
			this.dateStatus = STATUS_GOOD;
		} else if (nowMoment.isBefore(badMoment)) {
			this.dateStatus = STATUS_WARNING;
		} else {
			this.dateStatus = STATUS_BAD;
		}
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
