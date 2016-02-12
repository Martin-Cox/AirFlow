var projectSettings = function() {
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/projectSettings.html'
  }; 
};

module.exports = projectSettings;