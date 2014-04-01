votingApp.controller('beerController', function($scope, $http, $location, $timeout, loginService, votingService) {
	$scope.beerItems = [];
	$scope.updatedItems = [];
    $scope.message = '';
    $scope.alerts = [];

 	$scope.addAlert = function(name, rating) {
    	$scope.alerts.push( { type: 'success', msg: name + ' was updated to ' + rating } );
    	$timeout(function(){
        	$scope.closeAlert(0);
      	}, 2000);
 	};

 	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};
    if(!loginService.isLoggedIn) {
    	$location.path( '/' );
    }

    $http.get('/beers?{"$sort":{"name":%201}}')
  		.error(function(err) { 
  			return alert(err.message || "an error occurred");
  		}).then(function(results) {
  			$scope.loaded = true;
  			$scope.beerItems = results.data;
  			votingService.addBeers( results.data);
		});

    $http.get('/votes', { 
    	params : {
      		codeId: loginService.codeId,
      		isBeer: true
      }
 	})
 	.error(function(err) {
      // Alert if there's an error
      return alert(err.message || "an error occurred");
    })
    .then( function(results) {
 		$scope.updatedItems = results.data;
 		votingService.addVotes( results.data);
 		$scope.updateRatings();
    });

    $scope.updateRatings = function() {
    	votingService.updateRatings();
    };

   	$scope.createNewVote = function(beer,rating) {
    	//check to see if that record exists yet. 
		$http.post('/votes', {
	      codeId: loginService.codeId,
	      code: loginService.codeNumber,
	      beerId: beer.id,
	      rating: rating,
	      isBeer: true
	    }).success( function(beer) {
	    	//Change field to Update.
	    	$scope.addAlert(beerName, rating);
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
	}

	$scope.updateExistingVote = function( beer,rating, voteId, beerName) {
    	//check to see if that record exists yet. 
		$http.put('/votes', {
		  id: voteId,
	      rating: rating,
	      isBeer: true
	    }).success( function( beer) {
	    	//Change field to Update. 
	    	$scope.addAlert(beerName, rating);
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
	}

	$scope.saveVote = function(beer, rating) {
		//check to see if that record exists yet. 
		$http.get('/votes', { 
	    	params : {
	      	codeId: loginService.codeId,
	      	beerId: beer.id,
	      	isBeer: true
     		}
 		}).success(function(result) {
 			if(result.length == 0) {
 				//createNew
 				$scope.createNewVote( beer, rating);
 			} else {
 				//Update
 				$scope.updateExistingVote(beer, rating, result[0].id, beer.name);
 			}
 		});
	};

	$scope.finalizeVote = function() {
		  $http.put('/codes', {
	      id: loginService.codeId,
	      Used: true
	    }).success( function(beer) {
	    	//Change field to Update. 
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
	};
});