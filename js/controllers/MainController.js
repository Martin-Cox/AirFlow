var MainController = function($scope, $timeout) {

    var THREE = require('three');

    $scope.ajaxComplete = false;

    $scope.projectDetails = Object.create(null);

    $scope.defaultProjectDetails = null;
    $scope.defaultCase = null;
    $scope.defaultFans = null;
    $scope.defaultNewFan = null;
    $scope.defaultNewFanAOE = null;
    $scope.fanColors = null;

    $scope.particles = [];
    $scope.availableParticles = [];

    $scope.fans = [];
    $scope.exhaustFans = [];
    $scope.intakeFans = [];
    $scope.dragFan = null;
    $scope.editFan = null;
    $scope.originalFanPos = Object.create(null);

    $scope.caseGroup = Object.create(null);

    $scope.stats = Object.create(null);
    $scope.statsAnalysis = null;
    $scope.charts = Object.create(null);
    $scope.charts.drewCharts = false;

    $scope.addingFan = false;
    $scope.addingFanValidPos = false;
    $scope.newFanPlaceholderObject = Object.create(null);
    $scope.newFanPlaceholderObjectPosition = [];
    $scope.newFanPlaceholderWireframe = null;

    $scope.overrideCompSettings = false;

    $scope.displayingPopup = false;

    /*Hides the splash screen on user click if AJAX calls have completed*/
    $scope.hideSplash = function() {
        if ($scope.ajaxComplete === true) {
            var splashElement = document.getElementById("loadingSplash");
            splashElement.style.opacity = 0;    //Set splash element opacity to 0, triggering CSS transition

            //Have to remove the element from the DOM, otherwise it would still be there but be invisible, meaning we can't interact with anything else
            //Only wait 800ms, 1000ms is the time it takes for opacity transition, but user can see sim before that and may want to interact before opacity has finished

             $timeout(function() {
                //Show Help and Settings buttons
                document.getElementById("helpBoxButtonWrapper").style.visibility = "visible";

                //Show add/delete fan buttons
                document.getElementById("fanButtonsWrapper").style.visibility = "visible";
            }, 300);


            $timeout(function() {
                document.getElementsByClassName("main")[0].removeChild(splashElement);
            }, 800);

            $scope.newProject();
        }
    };

    /*Draws the charts on the results tab*/
    $scope.drawCharts = function() {
        if ($scope.charts.drewCharts === false) {
            $timeout(function() {
                $scope.drawParticleSuccessRatioChart();
                $scope.drawFanRatioChart();
                $scope.charts.drewCharts = true;
            }, 500);    //TODO: This should really be done using a promise and not a simple timer
        }
    };

    /*Starts a new project using the default project values*/
    $scope.newProject = function() {

        $scope.projectDetails.projectName = $scope.defaultProjectDetails.projectName;
        $scope.projectDetails.author = $scope.defaultProjectDetails.author;
        $scope.projectDetails.version = $scope.defaultProjectDetails.version;

        $scope.projectDetails.dateCreated = $scope.getCurrentDate();
        $scope.projectDetails.dateModified = $scope.getCurrentDate();

        //Reset values
        $scope.fans = [];
        $scope.exhaustFans = [];
        $scope.intakeFans = [];
        $scope.dragFan = null;
        $scope.editFan = null;

        $scope.stats = Object.create(null);

        //Recreate 3D scene
        $scope.emptyScene();
        $scope.init();
        $scope.animate();
    };

    /*Convert all relevant objects to JSON: $scope.projectDetails, $scope.stats, $scope.fans and put into a big JSON file for downloading/uploading*/
    $scope.saveProject = function() {

        var projectDetailsObject = JSON.stringify($scope.projectDetails);
        var projectStatsObject = JSON.stringify($scope.stats);

        var fansCompositeObj = Object.create(null);

        //Put each fan into a composite object
        for (var i = 0; i < $scope.fans.length; i++) {
            var fanObj = Object.create(null);
            fanObj.properties = $scope.fans[i].properties;
            fanObj.dimensions = $scope.fans[i].fanPhysicalObject.dimensions;
            fanObj.x = $scope.fans[i].fanPhysicalObject.position.x;
            fanObj.y = $scope.fans[i].fanPhysicalObject.position.y;
            fanObj.z = $scope.fans[i].fanPhysicalObject.position.z;
            fansCompositeObj[i] = fanObj;
        }

        var projectFansObject = JSON.stringify(fansCompositeObj);

        var airflowProjectFile = '{ "projectDetails": ' + projectDetailsObject + ', "stats": ' + projectStatsObject + ', "fans": ' + projectFansObject + '}';

        //Prompt user to download file
        var dLink = document.createElement('a');
        dLink.style.visibility = 'hidden';
        document.body.appendChild(dLink);
        var blob = new Blob([airflowProjectFile], { type: 'application/json' });
        dLink.href = URL.createObjectURL(blob);
        dLink.download = $scope.projectDetails.projectName + "_v" + $scope.projectDetails.version + ".json";
        dLink.click();
        dLink.remove();
    };

    /*Recreates a project from an uploaded project file
     *projectJSON = the parsed JSON object containing the project details provided in an uploaded file*/
    $scope.loadProject = function(projectJSON) {

        if (projectJSON.hasOwnProperty("projectDetails") && projectJSON.hasOwnProperty("stats") && projectJSON.hasOwnProperty("fans")) {

            $scope.removeFansAndParticles();

            $scope.projectDetails.projectName = projectJSON.projectDetails.projectName;
            $scope.projectDetails.author = projectJSON.projectDetails.author;
            $scope.projectDetails.version = projectJSON.projectDetails.version;

            $scope.projectDetails.dateCreated = projectJSON.projectDetails.dateCreated;
            $scope.projectDetails.dateModified = projectJSON.projectDetails.dateModified;

            $scope.stats.spawnedParticles = projectJSON.stats.spawnedParticles;
            $scope.stats.activeParticles = projectJSON.stats.activeParticles;
            $scope.stats.culledParticles = projectJSON.stats.culledParticles;
            $scope.stats.removedParticles = projectJSON.stats.removedParticles;
            $scope.stats.particleSuccessPercentage = projectJSON.stats.particleSuccessPercentage;
            $scope.stats.particleFailurePercentage = projectJSON.stats.particleFailurePercentage;
            $scope.stats.particleLivePercentage = projectJSON.stats.particleLivePercentage;
            $scope.stats.particleSuccessRatioVal = projectJSON.stats.particleSuccessRatioVal;
            $scope.stats.particleSuccessRatioMod = projectJSON.stats.particleSuccessRatioMod;
            $scope.stats.numFans = projectJSON.stats.numFans;
            $scope.stats.numExhaustFans = projectJSON.stats.numExhaustFans;
            $scope.stats.numIntakeFans = projectJSON.stats.numIntakeFans;

            //Reset values
            $scope.fans = [];
            $scope.exhaustFans = [];
            $scope.intakeFans = [];
            $scope.dragFan = null;
            $scope.editFan = null;

            var fans = projectJSON.fans;
            var size = 0;

            for (fan in fans) {
                size++;
            }

            for (var i = 0; i < size; i++) {
                $scope.createFan(fans[i], true, false);
            }

            $scope.$digest();
        } else {
            alert("Not an airflow project file");
        }
    };

    /*Once project file has been fully read, call loadProject() to recreate the project*/
    $scope.notifyProjectLoad = function(element) {
         $scope.$apply(function(scope) {
             var reader = new FileReader();
             reader.onloadend = function() {
                var projectJSON = JSON.parse(reader.result);
                $scope.loadProject(projectJSON);
             };
             reader.readAsText(element.files[0]);
         });
    };

    /*Returns a nicely formatted date*/
    $scope.getCurrentDate = function() {

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

    /*Make the help popup box visible to the user*/
    $scope.showHelpBox = function() {
        if ($scope.displayingPopup === false) {
            var helpBox = document.getElementById("helpPopupBox");
            helpBox.style.visibility = "visible";
            helpBox.style.opacity = 100;
            $scope.displayingPopup = true;
        }
    }

    /*Hide the help popup box from the user*/
    $scope.closeHelpBox = function() {
        var helpBox = document.getElementById("helpPopupBox");
        helpBox.style.visibility = "hidden";
        helpBox.style.opacity = 0;
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

    /*Update the project data modified field when a project detail is changed*/
    $scope.projectDetailsChange = function() {
        $scope.projectDetails.dateModified = $scope.getCurrentDate();
    }

    /*When the user edits a fan property, instantly update the 3D scene to reflect the changes made*/
    $scope.fanPropertiesChange = function() {
        $scope.projectDetails.dateModified = $scope.getCurrentDate();
        $scope.editFan.properties.forceVector = $scope.calculateForceVector($scope.editFan);
        $scope.editFan.properties.dateModified = $scope.getCurrentDate();
        $scope.resizeFan($scope.editFan);

        //Recreate intake fans/exhaust fans lists
        $scope.exhaustFans = [];
        $scope.intakeFans = [];

        for (var i = 0; i < $scope.fans.length; i++) {
            if ($scope.fans[i].properties.mode === "intake") {
                $scope.intakeFans.push($scope.fans[i]);
            } else if ($scope.fans[i].properties.mode === "exhaust") {
                $scope.exhaustFans.push($scope.fans[i]);
            }
        }
    }
};

module.exports = MainController;