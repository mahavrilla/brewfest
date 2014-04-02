votingApp.service('dataService', function($http){

	this.getBeers = function() {
			var promise = $http.get('/beers?{"$sort":{"name":%201}}').then( function( response) {
  				return response.data;
			});
			return promise;
	}

	this.getChili = function() {
			var promise = $http.get('/chili?{"$sort":{"name":%201}}').then( function( response) {
  				return response.data;
			});
			return promise;
	}

	this.getVotes = function() {
			var promise = $http.get('/votes').then( function( response) {
  				return response.data;
			});
			return promise;
	}

	//Creates a new voting record. 
 	this.createNewVote = function( codeId, codeNumber, rating, id, isBeer) {
    	//check to see if that record exists yet. 
		var promise = $http.post('/votes', {
	      codeId: codeId,
	      code: codeNumber,
	      beerId: id,
	      rating: rating,
	      isBeer: isBeer
	    }).then( function( response) {
	    	return response;
	    });	

	    return promise; 
 	}

 	//Updates Existing voting record. 
 	this.updateExistingVote = function( voteId, rating, isBeer) {
    	//check to see if that record exists yet. 
		var promise = $http.put('/votes', {
	      id: voteId,
	      rating: rating,
	      isBeer: isBeer
	    }).then( function( response) {
	    	return response;
	    });	

	    return promise;
 	}

 	this.checkExistingVote = function( codeId, itemId, getBeer) {
 		//check to see if that record exists yet. 
		var promise = $http.get('/votes', {
	    	params : {
		      	codeId: codeId,
		      	beerId: itemId,
		      	isBeer: getBeer
     		}
	    }).then( function( response) {
	    	return response.data;
	    });	

	    return promise;
 	}

 	this.checkVoteCode = function( codeNumber) {
 		//check to see if the code exists
		var promise = $http.get('/codes', { 
	      params : {
	      	Code: codeNumber
	      }
	    }).then( function( response) {
	    	return response.data;
	    });	

	    return promise;
 	}

 	this.finalize = function() {
 		$http.put('/codes', {
	      id: loginService.codeId,
	      Used: true
 		}).success( function(result) {

 		});
 	}
});

