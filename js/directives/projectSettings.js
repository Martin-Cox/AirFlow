app.directive('projectSettings', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/projectSettings.html' 
  }; 
});