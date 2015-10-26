app.directive('componentSettings', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/componentSettings.html' 
  }; 
});