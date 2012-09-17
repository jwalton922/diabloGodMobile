'use strict';

/* Directives */


angular.module('diabloApp.directives', []).
  directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  }]);
