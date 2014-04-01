votingApp.controller('chiliController', function($scope, $http, $location, $timeout, loginService, votingService) {
	$scope.chiliItems = [];
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

    $http.get('/chili?{"$sort":{"name":%201}}')
  		.error(function(err) { 
  			return alert(err.message || "an error occurred");
  		}).then(function(results) {
  			$scope.loaded = true;
  			$scope.chiliItems = results.data;
  			votingService.addChilis( results.data);
		});

    $http.get('/votes', { 
    	params : {
      		codeId: loginService.codeId,
      		isBeer: false 
      }
 	})
 	.error(function(err) {
      // Alert if there's an error
      return alert(err.message || "an error occurred");
    })
    .then( function(results) {
 		$scope.updatedItems = results.data;
 		votingService.addChiliVotes( results.data);
 		$scope.updateRatings();
    });

    $scope.updateRatings = function() {
    	votingService.updateChiliRatings();
    };

   	$scope.createNewVote = function(beer,rating) {
    	//check to see if that record exists yet. 
		$http.post('/votes', {
	      codeId: loginService.codeId,
	      code: loginService.codeNumber,
	      beerId: beer.id,
	      rating: rating,
	      isBeer: false
	    }).success( function(beer) {
	    	//Change field to Update.
	    	$scope.addAlert(beer, rating);
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
	      isBeer: false
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
	      	isBeer: false
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