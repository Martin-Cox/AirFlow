app.controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.ajaxComplete = false;

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
}]);