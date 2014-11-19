angular.module('JiNGle.directives').directive('jibreadcrumbs', function() {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'BreadcrumbsDirective.html',

        scope: {
            nodes: '=nodes'
        }
    };
});