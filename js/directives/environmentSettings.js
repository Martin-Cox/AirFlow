app.directive('environmentSettings', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/environmentSettings.html' 
  }; 
});