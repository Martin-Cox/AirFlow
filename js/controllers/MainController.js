app.controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.ajaxComplete = false;

    $scope.defaultCase = null;
    $scope.defaultFans = null;
    $scope.fanColors = null;

    $scope.fans = [];
    $scope.exhaustFans = [];
    $scope.intakeFans = [];
    $scope.editFan = null;

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
        if ($scope.editFan !== null) {
            //User is editing a fan, load values here
            console.log("Click on fan: " + $scope.editFan.id);
            //TODO: Distinction between user clicking on a new fan, and changing a value in the currently selected fan

        }
    });

}]);