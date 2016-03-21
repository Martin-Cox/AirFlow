var MainController = function($scope, $http) {

    $scope.ajaxComplete = false;

    $scope.projectDetails = new Object();

    $scope.defaultProjectDetails = null;
    $scope.defaultCase = null;
    $scope.defaultFans = null;
    $scope.defaultNewFan = null;
    $scope.fanColors = null;

    $scope.fans = [];
    $scope.exhaustFans = [];
    $scope.intakeFans = [];
    $scope.dragFan = null;
    $scope.editFan = null;
    $scope.originalFanPos = new Object();

    $scope.caseGroup = new Object();

    $scope.stats = [];
    $scope.charts = new Object();
    $scope.charts.drewCharts = false;

    $scope.addingFan = false;
    $scope.addingFanValidPos = false;
    $scope.newFanPlaceholderObject = new Object();
    $scope.newFanPlaceholderObjectPosition = [];
    $scope.newFanPlaceholderWireframe = null;

    $scope.overrideCompSettings = false;

    $scope.displayingPopup = false;

	angular.element(document).ready(function() {
        document.getElementById("loadingSplashLoadingText").innerHTML = "Click anywhere to begin";
    });

    $scope.hideSplash = function() {
        if ($scope.ajaxComplete === true) {
        	var splashElement = document.getElementById("loadingSplash");
            splashElement.style.opacity = 0;	//Set splash element opacity to 0, triggering CSS transition

            //Have to remove the element from the DOM, otherwise it would still be there but be invisible, meaning we can't interact with anything else
            //Only wait 900ms, 1000ms is the time it takes for opacity transition, but user can see sim before that and may want to interact before opacity has finished

            setTimeout(function() {
                //Show Help and Settings buttons
                document.getElementById("helpBoxButtonWrapper").style.visibility = "visible";

                //Show add/delete fan buttons
                document.getElementById("fanButtonsWrapper").style.visibility = "visible";
            }, 500);


            setTimeout(function() {
            	document.getElementsByClassName("main")[0].removeChild(splashElement);
            }, 900);

            $scope.newProject();
        }
    };

    $scope.drawCharts = function() {     
        if ($scope.charts.drewCharts === false) {   
            setTimeout(function() {
                $scope.drawParticleSuccessRatioChart();
                $scope.drawFanRatioChart();
                $scope.charts.drewCharts = true;
            }, 500);    //TODO: This should really be done using a promise and not a simple timer
        }
    }

    $scope.newProject = function() {
        //Starts a new project using the default values

        $scope.projectDetails = $scope.defaultProjectDetails;

        $scope.projectDetails.dateCreated = $scope.getCurrentDate();
        $scope.projectDetails.dateModified = $scope.getCurrentDate();

        //TODO: Reset Three.js scene
        $scope.stats = [];

        $scope.emptyScene();
        $scope.init();                    
        $scope.animate();
        $scope.spawnParticles();
    };

     $scope.saveProject = function() {
        console.log("Placeholder save project");
    };

     $scope.loadProject = function() {
        console.log("Placeholder load project");
    };

    $scope.getCurrentDate = function() {
        //Gets formatted date

        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1; //Months start counting at 0
        var year = today.getFullYear();

        if (day < 10) {
            //Append a 0 for nicer formatting
            day = "0" + day;
        }

        if (month < 10) {
            //Append a 0 for nicer formatting
            month = "0" + month;
        }

        var formattedDate = day + "/" + month + "/" + year;
        return formattedDate;
    };

    $scope.showHelpBox = function() {
        if ($scope.displayingPopup === false) {
            var helpBox = document.getElementById("helpPopupBox");
            helpBox.style.visibility = "visible"
            helpBox.style.opacity = 100;
            $scope.displayingPopup = true;
        }
    }

    $scope.closeHelpBox = function() {
        var helpBox = document.getElementById("helpPopupBox");
        helpBox.style.visibility = "hidden"
        helpBox.style.opacity = 0;
        $scope.displayingPopup = false;
    }

    $scope.showSettingsBox = function() {
        if ($scope.displayingPopup === false) {
            var settingsBox = document.getElementById("settingsPopupBox");
            settingsBox.style.visibility = "visible"
            settingsBox.style.opacity = 100;
            $scope.displayingPopup = true;
        }
    }

    $scope.closeSettingsBox = function() {
        var settingsBox = document.getElementById("settingsPopupBox");
        settingsBox.style.visibility = "hidden"
        settingsBox.style.opacity = 0;
        $scope.displayingPopup = false;
    }

    $scope.$watch('editFan', function() {
        //Angular doesn't like it when we set scope.editFan to null in deleteFan() so we have to set it to an empty array and use an override to disable component settings form
        if ($scope.editFan != null && $scope.editFan.length === 0) {
            $scope.overrideCompSettings = true;
        } else {
            $scope.overrideCompSettings = false;
        }
    });

    $scope.projectDetailsChange = function() {
        //The project details have been changed, update the modified date
        $scope.projectDetails.dateModified = $scope.getCurrentDate();
    }

    $scope.fanPropertiesChange = function(changedProperty) {
        //Called when the user edits a fan property
        $scope.projectDetails.dateModified = $scope.getCurrentDate();
        $scope.editFan.properties.forceVector = $scope.calculateForceVector($scope.editFan);
        $scope.resizeFan($scope.editFan);
    }

};

module.exports = MainController;