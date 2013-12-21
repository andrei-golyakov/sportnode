(function(){
	function Exercise(o) {
		this.id = o.id;
		this.name = o.name;
		this.period = o.period;
	}

	function sortFunction (a, b){
		if (a.name < b.name) {
			return -1;
		} else if (a.name > b.name) {
			return 1;
		} else {
			return 0;
		}
	}

	Exercise.sortFunction = sortFunction;

	exports.Exercise = Exercise;
})();
