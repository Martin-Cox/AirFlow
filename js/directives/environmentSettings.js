var environmentSettings = function() {
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/environmentSettings.html'
  }; 
};

module.exports = environmentSettings;