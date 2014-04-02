votingApp.service('votingService', function(){
	var updatedVotes = [];
	var updatedChiliVotes = [];
	var beerItems = [];
	var chiliItems = [];

	this.addVotes = function(votes) {
		this.updatedVotes = votes;
	}

	this.addBeers = function(beers) {
		this.beerItems = beers;
	}

	this.addChiliVotes = function(votes) {
		this.updatedChiliVotes = votes;
	}

	this.addChilis = function(chili) {
		this.chiliItems = chili;
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

	this.updateNewRatings = function(beers, votes) {
		for( var x = 0; x < beers.length; x++) {
			for( var i = 0; i < votes.length; i++) {
				if(votes[i].beerId == beers[x].id) {
					beers[x].rating = votes[i].rating;
				}
			}
		}
		return beers;
	}

	this.updateChiliRatings = function() {
		for( var x = 0; x < this.chiliItems.length; x++) {
			for( var i = 0; i < this.updatedChiliVotes.length; i++) {
				if(this.updatedChiliVotes[i].beerId == this.chiliItems[x].id) {
					this.chiliItems[x].rating = this.updatedChiliVotes[i].rating;
				}
			}
		}
	}



});