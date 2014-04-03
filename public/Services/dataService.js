votingApp.service('dataService', function($http, loginService){

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

	this.getVotes = function( code) {
			var promise = $http.get('/votes', {
				params: {
					code: code
				}
			}).then( function( response) {
  				return response.data;
			});
			return promise;
	}

	//Creates a new voting record. 
 	this.insertNewCodes = function( code, isUsed) {
    	//check to see if that record exists yet. 
		var promise = $http.post('/codes', {
	      Code: code,
	      Used: isUsed
	    }).then( function( response) {
	    	return response;
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
 		var promise = $http.put('/codes', {
	      id: loginService.codeId,
	      Used: true
 		}).then( function( response) {
 			return response.data;
 		});

 		return promise;
 	}

 	this.getAllCodes = function() {
 		//check to see if the code exists
		var promise = $http.get('/codes').then( function( response) {
	    	return response.data;
	    });	

	    return promise;
 	}

 	this.updateCode = function( codeId, isLocked) {
 		//check to see if the code exists
		var promise = $http.put('/codes', { 
			id: codeId,
			Used: isLocked
		}).then( function( response) {
	    	return response.data;
	    });	

	    return promise;
 	}
});

