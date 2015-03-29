angular.module('JiNGle.directives').directive('jitable', function($filter) {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'TableDirective.html',

        scope: {
            columns: '=columns',
            data: '=data',

            create: '@create',
            show: '@show',
            pdf: '@pdf',
            edit: '@edit',
            remove: '@delete'
        },

        link: function($scope, element, attrs) {
            $scope.defaultFormatter = $filter('ji_inline');

            // Apply sort rules from attribute
            $scope.sortRule = [ ];
            if (attrs.sort) attrs.sort.words(function(field) { $scope.sortRule.push(field); });

            $scope.isSortedAsc = function(field) { return this.sortRule.indexOf(field) !== -1; };
            $scope.isSortedDesc = function(field) { return this.sortRule.indexOf('-' + field) !== -1; };

            $scope.sortName = function(field) {
                var index = $scope.sortRule.indexOf(field);

                if (index === -1) {
                    index = $scope.sortRule.indexOf('-' + field);

                    if (index === -1) {
                        $scope.sortRule.unshift(field);
                        return;
                    }

                    $scope.sortRule.splice(index, 1);
                    return;
                }

                $scope.sortRule.splice(index, 1);
                $scope.sortRule.unshift('-' + field);
            };
        }
    }
});
