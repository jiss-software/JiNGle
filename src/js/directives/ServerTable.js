angular.module('JiNGle.directives').directive('jiservertable', function($http) {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'ServerTableDirective.html',

        scope: {
            columns: '=columns',
            source: '@source',

            create: '@create',
            show: '@show',
            pdf: '@pdf',
            edit: '@edit',
            remove: '@delete'
        },

        link: function($scope, element, attrs) {
            var load = function() {
                $scope.ready = false;
                
                var selection = {
                    skip: $scope.collection.skip,
                    limit: $scope.collection.limit,

                    query: ($scope.collection.query || ""),
    
                    filter: $scope.collection.filter,
                    order: $scope.collection.sortOrder
                };

                $http.put(attrs.source, selection).success(function(data) {
                    $scope.collection = data;

                    $scope.page = Math.ceil((data.skip || 0) / data.limit) + 1;
                    $scope.pageQuantity = Math.ceil(data.selectionSize / data.limit);

                    $scope.ready = true;
                });
            };

            $scope.sizes = [ 5, 10, 25, 50, 100 ];

            $scope.ready = false;

            $scope.page = 1;
            $scope.pageQuantity = 1;
            $scope.pagesInSelector = 10;

            $scope.collection = {
                collectionSize: 0,
                selectionSize: 0,

                skip: 0,
                limit: $scope.sizes[2],

                query: '',
                filter: {},
                sortOrder: {},

                data: [],
                meta: {}
            };

            $scope.isSortedAsc = function(field) { return $scope.collection.sortOrder[field] === 1; };
            $scope.isSortedDesc = function(field) { return $scope.collection.sortOrder[field] === -1; };

            $scope.isFiltered = function(field) { return $scope.collection.filter[field]; };

            $scope.sortName = function(field) {
                var rule = {};

                if ($scope.isSortedAsc(field)) {
                    rule[field] = -1;
                } else if ($scope.isSortedDesc(field)) {
                    if ($scope.collection.meta[field]
                        && $scope.collection.meta[field].defaultSort
                        && Object.keys($scope.collection.sortOrder).length === 1
                        && $scope.collection.sortOrder[field]) {

                        rule[field] = 1
                    }
                } else {
                    rule[field] = 1;
                }

                Object.keys($scope.collection.sortOrder, function(key) {
                    if (key == field) return;
                    rule[key] = $scope.collection.sortOrder[key];
                });

                $scope.collection.sortOrder = rule;

                load();
            };

            $scope.settings = {
                pageSize: $scope.collection.limit
            };

            $scope.changeSettings = function() {
                $scope.collection.limit = $scope.settings.pageSize;
                $scope.collection.skip = 0;

                load();
            };

            $scope.startSearch = function() {
                $scope.collection.skip = 0;
                $scope.collection.query = $scope.settings.query;

                load();
            };

            $scope.goToPage = function(page) {
                $scope.collection.skip = (page - 1) * $scope.settings.pageSize;

                load();
            };

            $scope.cellFormat = function(row, column) {
                return column.format ? column.format(row[column.field]) : row[column.field];
            };

            $scope.asRow = function(value, field) {
                var row = {};
                row[field] = value;
                return row;
            };


            $scope.isVisibleSelector = function(page) {
                return page == 1
                    || page == $scope.pageQuantity
                    || page <= $scope.page + $scope.pagesInSelector
                        && page >= $scope.page - $scope.pagesInSelector;
            };

            load();
        }
    }
});
