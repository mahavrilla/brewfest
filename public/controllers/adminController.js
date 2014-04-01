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
	    }

	     $scope.showChiliVotes = function() {
	    	$scope.showChili = true;
	    	$scope.showBeer = false;
	    }

	    $scope.showEnterItems = function() {
	    	$scope.showChili = false;
	    	$scope.showBeer = false;
	    }

	    $scope.refreshVotes = function() {
	    	$scope.loadData();
	    }

});