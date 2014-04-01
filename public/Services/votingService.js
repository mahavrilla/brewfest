votingApp.service('votingService', function(){
	var updatedVotes = [];
	var beerItems = [];

	this.addVotes = function(votes) {
		this.updatedVotes = votes;
	}

	this.addBeers = function(beers) {
		this.beerItems = beers;
	}

	this.getSize = function() {
		return this.updatedVotes.length;
	}

	this.updateRatings = function() {
		for( var x = 0; x < this.beerItems.length; x++) {
			for( var i = 0; i < this.updatedVotes.length; i++) {
				if(this.updatedVotes[i].beerId == this.beerItems[x].id) {
					this.beerItems[x].rating = this.updatedVotes[i].rating;
				}
			}
		}
	}
});