angular.module('JiNGle.filters').filter('ji_checkmark', function() {
    'use strict';

    return function(input, no, yes) {
        return input ? yes || '✓' : no || '✘';
    };
});