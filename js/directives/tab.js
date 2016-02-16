var tab = function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
    require: '^tabs',
    scope: {
    	heading: '@'
    },
    link: function(scope, elem, attr, tabsController) {
    	scope.active = false;
    	tabsController.addTab(scope);
    }
  };
};

module.exports = tab;