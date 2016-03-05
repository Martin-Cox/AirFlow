var resultsPanel = function() {
  return { 
    restrict: 'E', 
    scope: false,
    templateUrl: 'js/directives/resultsPanel.html',
    link: function(scope, elem, attr) {
    }
  }; 
};

module.exports = resultsPanel;