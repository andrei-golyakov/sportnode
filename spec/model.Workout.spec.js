var moment = require('moment');
var Workout = require('../lib/model/workout').Workout;

// good workouts

var goodWorkout1day = new Workout({
	date: moment().add('days', -1).toDate(),
	dateBetween: 1
});

var goodWorkout2days = new Workout({
	date: moment().add('days', -1).toDate(),
	dateBetween: 2
});

// warning workouts

var warningWorkout1day = new Workout({
	date: moment().add('days', -2).toDate(),
	dateBetween: 1
});

var warningWorkout2days = new Workout({
	date: moment().add('days', -3).toDate(),
	dateBetween: 2
});

// bad workouts

var badWorkout1day = new Workout({
	date: moment().add('days', -3).toDate(),
	dateBetween: 1
});

var badWorkout2days = new Workout({
	date: moment().add('days', -4).toDate(),
	dateBetween: 2
});

var badWorkoutLongTimeAgo = new Workout({
	date: new Date("2013-11-06T08:44:16Z"),
	dateBetween: 7
});

describe('Workout', function() {
	it('should have good date status if last workout was yesterday and 1 day are allowed between workouts', function() {
		expect(goodWorkout1day.dateStatus).toBe('good');
	});
});

describe('Workout', function() {
	it('should have good date status if last workout was yesterday and 2 days are allowed between workouts', function() {
		expect(goodWorkout2days.dateStatus).toBe('good');
	});
});

describe('Workout', function() {
	it('should have warning date status if last workout was 2 days ago and 1 day is allowed between workouts', function() {
	
		expect(warningWorkout1day.dateStatus).toBe('warning');
	});
});

describe('Workout', function() {
	it('should have warning date status if last workout was 3 days ago and 2 days are allowed between workouts', function() {
	
		expect(warningWorkout2days.dateStatus).toBe('warning');
	});
});

describe('Workout', function() {
	it('should have bad date status if last workout was 3 days ago and 1 day is allowed between workouts', function() {
		expect(badWorkout1day.dateStatus).toBe('bad');
	});
});

describe('Workout', function() {
	it('should have bad date status if last workout was 4 days ago and 2 day is allowed between workouts', function() {
		expect(badWorkout2days.dateStatus).toBe('bad');
	});
});

describe('Workout', function() {
	it('should have bad date status if last workout was very long time ago and 7 days is allowed between workouts', function() {
		expect(badWorkoutLongTimeAgo.dateStatus).toBe('bad');
	});
});

// Workout.sortFunction (result: less)

describe('Workout.sortFunction', function() {
	it('should return -1 for bad and good workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(badWorkout1day, goodWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout1day, goodWorkout2days);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout2days, goodWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout2days, goodWorkout2days);
		expect(actual).toBe(-1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return -1 for bad and warning workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(badWorkout1day, warningWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout1day, warningWorkout2days);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout2days, warningWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(badWorkout2days, warningWorkout2days);
		expect(actual).toBe(-1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return -1 for warming and good workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(warningWorkout1day, goodWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(warningWorkout1day, goodWorkout2days);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(warningWorkout2days, goodWorkout1day);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(warningWorkout2days, goodWorkout2days);
		expect(actual).toBe(-1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return -1 for 2 workouts of the same type if days between of the first workout less than of the second one', function() {
		var actual;
		
		actual = Workout.sortFunction(badWorkout1day, badWorkout2days);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(warningWorkout1day, warningWorkout2days);
		expect(actual).toBe(-1);
		
		actual = Workout.sortFunction(goodWorkout1day, goodWorkout2days);
		expect(actual).toBe(-1);
	});
});

// Workout.sortFunction (result: more)

describe('Workout.sortFunction', function() {
	it('should return 1 for good and bad workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(goodWorkout1day, badWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout2days, badWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout1day, badWorkout2days);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout2days, badWorkout2days);
		expect(actual).toBe(1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return 1 for good and warning workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(goodWorkout1day, warningWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout2days, warningWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout1day, warningWorkout2days);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout2days, warningWorkout2days);
		expect(actual).toBe(1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return 1 for warning and bad workouts (independently of days between)', function() {
		var actual;
		
		actual = Workout.sortFunction(warningWorkout1day, badWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(warningWorkout2days, badWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(warningWorkout1day, badWorkout2days);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(warningWorkout2days, badWorkout2days);
		expect(actual).toBe(1);
	});
});

describe('Workout.sortFunction', function() {
	it('should return 1 for 2 workouts of the same type if days between of the first workout more than of the second one', function() {
		var actual;
		
		actual = Workout.sortFunction(badWorkout2days, badWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(warningWorkout2days, warningWorkout1day);
		expect(actual).toBe(1);
		
		actual = Workout.sortFunction(goodWorkout2days, goodWorkout1day);
		expect(actual).toBe(1);
	});
});

// Workout.sortFunction (result: equals)

describe('Workout.sortFunction', function() {
	it('should return 0 for 2 workouts of the same type with the same values of days between workouts', function() {
		var actual;
		
		actual = Workout.sortFunction(badWorkout1day, badWorkout1day);
		expect(actual).toBe(0);
		
		actual = Workout.sortFunction(badWorkout2days, badWorkout2days);
		expect(actual).toBe(0);
		
		actual = Workout.sortFunction(warningWorkout1day, warningWorkout1day);
		expect(actual).toBe(0);
		
		actual = Workout.sortFunction(warningWorkout2days, warningWorkout2days);
		expect(actual).toBe(0);
		
		actual = Workout.sortFunction(goodWorkout1day, goodWorkout1day);
		expect(actual).toBe(0);
		
		actual = Workout.sortFunction(goodWorkout2days, goodWorkout2days);
		expect(actual).toBe(0);
	});
});
