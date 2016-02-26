var MainController = function($scope, $http) {

    $scope.ajaxComplete = false;

    $scope.defaultCase = null;
    $scope.defaultFans = null;
    $scope.defaultNewFan = null;
    $scope.fanColors = null;

    $scope.fans = [];
    $scope.exhaustFans = [];
    $scope.intakeFans = [];
    $scope.dragFan = null;
    $scope.editFan = null;

    $scope.caseGroup= new Object();

    $scope.stats = [];

    $scope.addingFan = false;
    $scope.addingFanValidPos = false;
    $scope.newFanPlaceholderObject = null;
    $scope.newFanPlaceholderWireframe = null;

    $scope.overrideCompSettings = false;

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
        //Angular doesn't like it when we set scope.editFan to null in deleteFan() so we have to set it to an empty array and use an override to disable component settings form
        if ($scope.editFan != null && $scope.editFan.length === 0) {
            $scope.overrideCompSettings = true;
        } else {
            $scope.overrideCompSettings = false;
        }
    });

    $scope.propertiesChange = function(changedProperty) {
        //Called when the user edits a fan property
        $scope.editFan.properties.forceVector = $scope.calculateForceVector($scope.editFan);
        $scope.resizeFan($scope.editFan);
    }

};

module.exports = MainController;