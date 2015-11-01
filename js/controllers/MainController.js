app.controller('MainController', ['$scope', function($scope) {

	angular.element(document).ready(function() {
        document.getElementById('loadingSplashLoadingText').innerHTML = 'Click anywhere to begin';
    });

    $scope.hideSplash = function() {
    	var splashElement = document.getElementById('loadingSplash');
        splashElement.style.opacity = 0;	//Set splash element opacity to 0, triggering CSS transition

        //Have to remove the element from the DOM, otherwise it would still be there but be invisible, meaning we can't interact with anything else
        setTimeout(function() {
        	document.getElementsByClassName("main")[0].removeChild(splashElement);
        },1000);
    };

}]);