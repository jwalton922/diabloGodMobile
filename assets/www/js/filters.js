'use strict';

/* Filters */

angular.module('diabloApp.filters', []).
  filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
