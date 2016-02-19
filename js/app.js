var angular = require('angular');

var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var Physijs = require('physijs-browserify')(THREE);

var ComponentController = require('./controllers/ComponentController');
var EnvironmentController = require('./controllers/EnvironmentController');
var MainController = require('./controllers/MainController');
var ProjectSettingsController = require('./controllers/ProjectSettingsController');
var ResultsController = require('./controllers/ResultsController');
var tabs = require('./directives/tabs');
var tab = require('./directives/tab');
var componentSettings = require('./directives/componentSettings');
var environmentSettings = require('./directives/environmentSettings');
var projectSettings = require('./directives/projectSettings');
var resultsPanel = require('./directives/resultsPanel');
var simulation = require('./directives/simulation');
var defaultsService = require('./services/defaultsService');

var app = angular.module("AirFlowApp", []);

app.controller('ComponentController', ['$scope', ComponentController]);
app.controller('EnvironmentController', ['$scope', EnvironmentController]);
app.controller('MainController', ['$scope', MainController]);
app.controller('ProjectSettingsController', ['$scope', ProjectSettingsController]);
app.controller('ResultsController', ['$scope', ResultsController]);
app.directive('tabs', [tabs]);
app.directive('tab', [tab]);
app.directive('componentSettings', [componentSettings]);
app.directive('environmentSettings', [environmentSettings]);
app.directive('projectSettings', [projectSettings]);
app.directive('resultsPanel', [resultsPanel]);
app.service('defaultsService', ['$http', defaultsService]);
app.directive('simulation', ['$http', 'defaultsService', simulation]);