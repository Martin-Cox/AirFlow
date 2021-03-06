var angular = require('angular');

var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var Physijs = require('physijs-browserify')(THREE);
var Chart = require('chart.js');

var ComponentController = require('./controllers/ComponentController');
var EnvironmentController = require('./controllers/EnvironmentController');
var MainController = require('./controllers/MainController');
var ProjectDetailsController = require('./controllers/ProjectDetailsController');
var ResultsController = require('./controllers/ResultsController');
var HelpBoxController = require('./controllers/HelpBoxController');
var SettingsBoxController = require('./controllers/SettingsBoxController');
var tabs = require('./directives/tabs');
var tab = require('./directives/tab');
var componentSettings = require('./directives/componentSettings');
var environmentSettings = require('./directives/environmentSettings');
var projectDetails = require('./directives/projectDetails');
var resultsPanel = require('./directives/resultsPanel');
var simulation = require('./directives/simulation');
var helpBox = require('./directives/helpBox');
var defaultsService = require('./services/defaultsService');

var app = angular.module("AirFlowApp", []);

app.controller('ComponentController', ['$scope', ComponentController]);
app.controller('EnvironmentController', ['$scope', EnvironmentController]);
app.controller('MainController', ['$scope', '$timeout', MainController]);
app.controller('ProjectDetailsController', ['$scope', ProjectDetailsController]);
app.controller('ResultsController', ['$scope', ResultsController]);
app.controller('HelpBoxController', ['$scope', HelpBoxController]);
app.controller('SettingsBoxController', ['$scope', SettingsBoxController]);
app.directive('tabs', [tabs]);
app.directive('tab', [tab]);
app.directive('componentSettings', [componentSettings]);
app.directive('environmentSettings', [environmentSettings]);
app.directive('projectDetails', [projectDetails]);
app.directive('resultsPanel', [resultsPanel]);
app.directive('helpBox', [helpBox]);
app.service('defaultsService', ['$http', defaultsService]);
app.directive('simulation', ['$http', 'defaultsService', '$timeout', simulation]);