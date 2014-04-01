votingApp.service('adminService', function(){
	var sumVotes = [];
	var voteItems = [];


	this.addVotes = function(votes) {
		this.sumVotes = votes;
	}

	this.addItems = function(beers) {
		this.voteItems = beers;
	}

	this.getRatings = function() {
		for( var x = 0; x < this.voteItems.length; x++) {
			for( var i = 0; i < this.sumVotes.length; i++) {
				if(this.sumVotes[i].beerId == this.voteItems[x].id) {
					this.voteItems[x].rating += this.sumVotes[i].rating;
				}
			}
		}
		return voteItems;
	}
	
});