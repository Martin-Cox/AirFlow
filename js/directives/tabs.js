var tabs = function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: { },
    templateUrl: 'js/directives/tabs.html',
    bindToController: true,
    controllerAs: 'tabs',
    controller: function() {
      var self = this;
      self.tabs = [];

      self.addTab = function addTab(tab) {
        self.tabs.push(tab);

        if(self.tabs.length === 1) {
            tab.active = true
        } else {
            tab.inactive = true;
        }
      }

      self.select = function(selectedTab) {
        angular.forEach(self.tabs, function(tab) {
          if(tab.active && tab !== selectedTab) {
            tab.active = false;
            tab.inactive = true;
          }
        });

        selectedTab.active = true;
      }

    }
  }
};

module.exports = tabs;