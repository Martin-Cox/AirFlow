app.controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.ajaxComplete = false;

    $scope.defaultCase = null;
    $scope.defaultFans = null;
    $scope.fanColors = null;

    $scope.fans = [];
    $scope.exhaustFans = [];
    $scope.intakeFans = [];
    $scope.dragFan = null;
    $scope.editFan = null;

    $scope.caseGroup= [];

	angular.element(document).ready(function() {
        document.getElementById('loadingSplashLoadingText').innerHTML = 'Click anywhere to begin';
    });

    $scope.hideSplash = function() {
        if ($scope.ajaxComplete === true) {
        	var splashElement = document.getElementById('loadingSplash');
            splashElement.style.opacity = 0;	//Set splash element opacity to 0, triggering CSS transition

            //Have to remove the element from the DOM, otherwise it would still be there but be invisible, meaning we can't interact with anything else
            //Only wait 800ms, 1000ms is the time it takes for opacity transition, but user can see sim before that and may want to interact before opacity has finished
            setTimeout(function() {
            	document.getElementsByClassName("main")[0].removeChild(splashElement);
            }, 800);

            $scope.animate();
            $scope.spawnParticles();
        }
    };

    $scope.$watch('editFan', function() {
        if ($scope.editFan != null) {
            //User is editing a fan, expand component settigns section here
            //Component settings section will automatically update with values, so we don't need to change anything
        }
    });

    $scope.propertiesChange = function(changedProperty) {
        //Called when the user edits a fan property
        $scope.editFan.properties.forceVector = $scope.calculateForceVector($scope.editFan);
        $scope.resizeFan($scope.editFan);
    }

}]);