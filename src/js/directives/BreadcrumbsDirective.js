angular.module('JiNGle.directives').directive('jibreadcrumbs', function() {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'BreadcrumbsDirective.html',

        scope: {
            nodes: '=nodes'
        },
        
        link: function($scope) {
            $scope.isActive = function(node) {
                return typeof node.active !== "undefined" && node.active || node === $scope.nodes[$scope.nodes - 1]
            };    
        }
    };
});
