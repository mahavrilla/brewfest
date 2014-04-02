// create the controller and inject Angular's $scope
votingApp.controller('adminController', function($scope, $http, $location, adminService, dataService, $window) {

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
	$scope.showManage = false;
	$scope.showExtras = false;
	$scope.newItems = [];
	$scope.count = 0;
	//$scope.getArray = [{a: $scope.codes[0]}, {a: $scope.code[1] }];

    $scope.generateCodes = function( number) {
        $scope.csvData = [];
    
        for( var x = 0; x < number; x++) {
            $scope.randomNumber = Math.floor(Math.random()*9000) + 1000;
            $scope.csvData.push({ a: $scope.randomNumber });
        }
        $scope.insertRandomCodes();
        $scope.noOfCodes = '';
    }

    $scope.insertRandomCodes = function() {
        angular.forEach($scope.csvData, function(value, key) {
            dataService.insertNewCodes( value.a.toString() , false).then( function( response) {
            });
        });
    }

    $scope.lockSingleCode = function( code) {
        dataService.checkVoteCode( code).then( function( response) {
            if(response.length == 0) {
                $scope.lockSingleMessage = 'No Code Found';
            } else {
                dataService.updateCode( response[0].id, true).then( function( response) {
                    $scope.lockSingleMessage = 'Locked code ' + response.Code;
                });
            }
            $scope.lockCode = '';
        });
    }

    $scope.unlockSingleCode = function( code) {
        dataService.checkVoteCode( code).then( function( response) {
            if(response.length == 0) {
                $scope.unlockSingleMessage = 'No Code Found: code';
            } else {
                dataService.updateCode(response[0].id , false).then( function( response) {
                     $scope.unlockSingleMessage  = 'unlocked code: ' + response.Code;
                });
            }
            $scope.unlockCode = '';
        });
    }

    $scope.getCodes = function() {
        $scope.csvData = [];
        dataService.getAllCodes().then( function( result) {
            angular.forEach(result, function(value, key) {
                 $scope.csvData.push( { a: value.Code} );
            });
        });
    }

	$scope.loadData = function()  {

		//Love me some promises to get data. 
		dataService.getBeers().then(function( d) {
	    	$scope.beers = d;

	    	//level 2
	    	dataService.getVotes().then(function( votes) {
	    		$scope.votes = votes;
	    		$scope.calculate( $scope.votes, $scope.beers);
	   		 });
	    });

		//Promises bitch. 
		dataService.getChili().then(function( d) {
	    	$scope.chili = d;

	    	//level 2
	    	dataService.getVotes().then(function( votes) {
	    		$scope.votes = votes;
	    		$scope.calculate( $scope.votes, $scope.chili);
	   		 });
	    });
	}

    $scope.calculate = function(voteItems, items) {
    	for( var x = 0; x < items.length; x++) {
    		$scope.sum = 0;
			for( var i = 0; i < voteItems.length; i++) {
				if(voteItems[i].beerId == items[x].id) {
					$scope.sum += $window.Math.round(items[x].rating + voteItems[i].rating);
				}
			}
			items[x].rating = $scope.sum;
		}
    }

    $scope.loadData();

    $scope.showBeerVotes = function() {
    	$scope.showChili = false;
    	$scope.showBeer = true;
    	$scope.showManage = false;
    	$scope.showExtras = false;
    }

     $scope.showChiliVotes = function() {
    	$scope.showChili = true;
    	$scope.showBeer = false;
    	$scope.showManage = false;
    	$scope.showExtras = false;
    }

    $scope.showManageItems = function() {
    	$scope.showChili = false;
    	$scope.showBeer = false;
    	$scope.showManage = true;
    	$scope.showExtras = false;
    }

     $scope.showExtraItems = function() {
    	$scope.showChili = false;
    	$scope.showBeer = false;
    	$scope.showManage = false;
    	$scope.showExtras = true;
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
    	if(isBeer) {
    		$http.delete('/beers?id=' + id, { 
	 		}).success(function(result) {
 			});
    	} else {
    		$http.delete('/chili?id=' + id, { 
	 		}).success(function(result) {
 			});
    	}
    }

    $scope.lockAllCodes = function() {
    	$scope.allCodes = [];
    	$scope.count = 0;
    	dataService.getAllCodes().then( function( d) {
    		$scope.allCodes = d;
    
    		//level 2
    		angular.forEach($scope.allCodes, function(value, key) {
    			dataService.updateCode( value.id, true).then( function( response) {
    				$scope.count++;
                    $scope.lockMessage = 'Locked ' + $scope.count  +' codes';
    			});
                
    		});
    	});
    }

    $scope.unlockAllCodes = function() {
    	$scope.allCodes = [];
    	$scope.count = 0;
    	dataService.getAllCodes().then( function( d) {
    		$scope.allCodes = d;
    
    		//level 2
    		angular.forEach($scope.allCodes, function(value, key) {
    			dataService.updateCode( value.id, false).then( function( response) {
                    $scope.count++;
    				$scope.unlockMessage = 'Unlocked ' + $scope.count + ' codes';
    			});
    		});
    	});
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
 				$scope.newItems.push( { id: value.id, name: value.name, isBeer: false, isBrewersChoice: false, disabled: true} );
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
    		} else if(value.name && value.isNew) {
    			$scope.insertChilis(value);
    			value.disabled = true;
    		} 
    	});
    }

    $scope.insertBeers = function(beer) {
    	$http.post('/beers', {
    		name: beer.name,
    		isBrewersChoice: beer.isBrewersChoice,
    		rating: 0
	    }).success( function(beer) {
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
    }

    $scope.insertChilis = function(chili) {
    	$http.post('/chili', {
    		name: chili.name,
    		rating: 0
	    }).success( function(beer) {
	    }).error(function(err) {
	      // Alert if there's an error
	      return alert(err.message || "an error occurred");
	    });
    }

});