var ProjectSettingsController = function($scope) {
	$scope.master = {};

	  $scope.update = function(settings) {
	    $scope.master = angular.copy(settings);
	  };

	  $scope.reset = function() {
	    $scope.settings = angular.copy($scope.master);
	  };

	  $scope.reset();
};

module.exports = ProjectSettingsController;