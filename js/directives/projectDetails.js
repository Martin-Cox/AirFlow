var projectDetails = function() {
  return { 
    restrict: 'E', 
    scope: { 
      settings: '=' 
    }, 
    templateUrl: 'js/directives/projectDetails.html'
  }; 
};

module.exports = projectDetails;