app.controller('ProjectSettingsController', ['$scope', function($scope) {
	$scope.master = {};

	  $scope.update = function(settings) {
	    $scope.master = angular.copy(settings);
	  };

	  $scope.reset = function() {
	    $scope.settings = angular.copy($scope.master);
	  };

	  $scope.reset();
}]);