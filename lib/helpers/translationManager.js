var i18n = require("i18n");

function getTranslations(res, page) {
	var result = {};
	result['layout'] = {
		home: res.__('Home'),
		workouts: res.__('Workouts'),
		configureExercises: res.__('ConfigureExercises'),
		email: res.__('Email'),
		password: res.__('Password'),
		signIn: res.__('Sign in'),
		logout: res.__('Logout'),
		developedBy: res.__('DevelopedBy')
	};

	switch (page) {
		case 'index':
			result ['index'] = {
				welcome: res.__('Welcome')
			};
			break;
		case 'workout':
			result ['workout'] = {
				latestWorkouts: res.__('LatestWorkouts')
			}
			break;
		case 'workoutsRun':
			result ['workoutRun'] = {

			}
			break;
		case 'exercise':
			result ['exercise'] = {
				exercises: res.__('Exercises'),
				exerciseName: res.__('ExerciseName'),
				exercisePeriod: res.__('ExercisePeriod'),
				addNewExercise: res.__('AddNewExercise'),
				addNewExerciseName: res.__('AddNewExerciseName'),
				addNewExercisePeriod: res.__('AddNewExercisePeriod')
			}
			break;
	}

	return result;
}

exports.translations = getTranslations;
