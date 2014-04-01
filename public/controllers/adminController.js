// create the controller and inject Angular's $scope
votingApp.controller('adminController', function($scope, $http, $location, adminService, $window) {

	// create a message to display in our view
	$scope.Math = window.Math;
	$scope.message = 'Enter ID!';
	$scope.entryCode = ''; 
	$scope.showLoginError = false;
	$scope.votes = [];
	$scope.beers = [];
	$scope.chili = [];
	$scope.sum = 0;
	$scope.predicate = '-rating';
	$scope.showBeer = true;
	$scope.showChili = false;
	$scope.showEnter = false;
	$scope.newItems = [];

	$scope.loadData = function()  {
		$http.get('/votes', { 
		 	})
		 	.error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    })
		    .then( function(results) {
		 		$scope.votes = results.data;
		 		adminService.addVotes( results.data);
		 		if($scope.votes && $scope.beers) {
		 			$scope.calculate( $scope.votes, $scope.beers);
		 		}

		    });

		    $http.get('/beers')
		 	.error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    })
		    .then( function(results) {
		 		$scope.beers = results.data;
		 		adminService.addItems( results.data);
		 		//$scope.beers = adminService.getRatings();
		 		if($scope.votes && $scope.beers) {
		 			$scope.calculate( $scope.votes, $scope.beers);
		 		}
		    });


		    $http.get('/chili')
		 	.error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    })
		    .then( function(results) {
		 		$scope.chili = results.data;
		 		//adminService.addItems( results.data);
		 		//$scope.beers = adminService.getRatings();
		 		if($scope.votes && $scope.chili) {
		 			$scope.calculate( $scope.votes, $scope.chili);
		 		}
		    });

	    }

	    $scope.calculate = function(voteItems, sumBeers) {
	    	for( var x = 0; x < sumBeers.length; x++) {
	    		$scope.sum = 0;
				for( var i = 0; i < voteItems.length; i++) {
					if(voteItems[i].beerId == sumBeers[x].id) {
						//sumBeers[i].rating += voteItems[x].rating;
						$scope.sum += $window.Math.round(sumBeers[x].rating + voteItems[i].rating);
						//alert(sumBeers[x].name + ' ' + $scope.sum + ' ' + voteItems[i].rating);
					}
				}
				sumBeers[x].rating = $scope.sum;
			}
	    }

	    $scope.showBeerVotes = function() {
	    	$scope.showChili = false;
	    	$scope.showBeer = true;
	    	$scope.showEnter = false;
	    }

	     $scope.showChiliVotes = function() {
	    	$scope.showChili = true;
	    	$scope.showBeer = false;
	    	$scope.showEnter = false;
	    }

	    $scope.showEnterItems = function() {
	    	$scope.showChili = false;
	    	$scope.showBeer = false;
	    	$scope.showEnter = true;
	    }

	    $scope.refreshVotes = function() {
	    	$scope.loadData();
	    }

	    $scope.addNewItem = function() {
	    	$scope.newItems.push({ name: '', isBeer: false, isBrewersChoice: false, isNew : true});
	    }

	    $scope.removeNewItem = function(index) {
	    	$scope.removeFromDatabase( $scope.newItems[index].id, $scope.newItems[index].isBeer );
	    	$scope.newItems.splice(index, 1);
	    }

	    $scope.removeFromDatabase = function(id, isBeer) {
	    	alert(id + isBeer);
	    	if(isBeer) {
	    		$http.delete('/beers?id=' + id, { 
		 		}).success(function(result) {
	 			});
	    	}
	    	
	    }

	    $scope.getItems = function() {
	    	$http.get('/beers', { 
	 		}).success(function(result) {
	 			if(result.length == 0) {
	 				$scope.newItems.push({ id: '', name: '', isBeer: false, isBrewersChoice: false, disabled: false})
	 			} 
	 			angular.forEach(result, function(value, key) {
	 				$scope.newItems.push( { id: value.id, name: value.name, isBeer: true, isBrewersChoice: value.isBrewersChoice, disabled: true});
	 			});
	 		});
	 		$http.get('/chili', { 
	 		}).success(function(result) {
	 			if(result.length == 0) {
	 				$scope.newItems.push({ id: '', name: '', isBeer: false, isBrewersChoice: false})
	 			} 
	 			angular.forEach(result, function(value, key) {
	 				$scope.newItems.push( value );
	 			});
	 		});
	    }

	    $scope.getItems();


	    $scope.insertNewItems = function() {
	    	$scope.newBeerItems = [];
	    	$scope.newChilItems = [];

	    	angular.forEach($scope.newItems, function(value, key) {
	    		if(value.isBeer && value.name && value.isNew) {
	    			$scope.insertBeers(value);
	    			value.disabled = true;
	    		} else if(value.name) {
	    			$scope.newChilItems.push(value);
	    		} 
	    	});
	    }

	    $scope.insertBeers = function(beer) {
	    	$http.post('/beers', {
	    		name: beer.name,
	    		isBrewersChoice: beer.isBrewersChoice
		    }).success( function(beer) {
		    }).error(function(err) {
		      // Alert if there's an error
		      return alert(err.message || "an error occurred");
		    });
	    }

});