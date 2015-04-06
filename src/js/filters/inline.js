angular.module('JiNGle.filters').filter('ji_inline', function() {
    'use strict';

    return function(input, maxLength, side) {
        if (typeof input !== 'string') return input;

        var short = input.words().join(' ');
        if (! maxLength || short.length <= maxLength) return short;

        return short.truncateOnWord(maxLength - 3, side);
    };
});
