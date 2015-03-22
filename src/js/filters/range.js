angular.module('JiNGle.filters').filter('range', function() {
    'use strict';

    return function(end, start, step, reverse) {
        end = parseInt(end | "0");
        start = parseInt(start | "0");
        step = parseInt(step | "1");

        var result = [];

        var i = 0;
        if (reverse) for (i = end; i >= start; i -= step) result.push(i);
        else for (i = start; i <= end; i += step) result.push(i);

        return result;
    };
});
