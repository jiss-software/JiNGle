var JiNGle = (function() {
    var conf = {
        rootPath: '',
        scriptPath: '',
        viewPath: ''
    };

    var scripts = document.getElementsByTagName('script');
    var currentPath = scripts[scripts.length-1].src;

    conf.rootPath = currentPath.substring(0, currentPath.lastIndexOf('/js/') + 1);

    conf.scriptPath = conf.rootPath + 'js/';
    conf.viewPath = conf.rootPath + 'views/';

    return conf;
})();

angular.module('JiNGle.directives', []);
angular.module('JiNGle.filters', []);
angular.module('JiNGle.interceptor', []);;window.notyData = {
    loadingQty: 0,
    loading: null
};

angular.module('JiNGle.interceptor').factory('HttpInterceptor', function($q) {
    var progressBar = '<div class="progress">' +
        '<div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div>' +
        '</div>';

    var isSystemCall = function(method, url) {
        return method.toUpperCase() == 'GET'
            && (url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.json'))
            || url.has('/lib/') || url.has('system');
    };

    return {
        request: function(config) {
            if (isSystemCall(config.method, config.url)) return config;
            console.log('Request: ' + config.method + ' - ' + config.url);

            if (config.method.toUpperCase() == 'GET') return config;

            window.notyData.loadingQty++;
            if (! window.notyData.loading)
                window.notyData.loading = noty({ text: 'Loading...<br />' + progressBar, timeout: false, killer: true });

            return config;
        },

        response: function (response) {
            if (isSystemCall(response.config.method, response.config.url)
                || response.config.method.toUpperCase() == 'GET') return response || $q.when(response);

            window.notyData.loadingQty--;
            if (window.notyData.loadingQty < 1) {
                if (window.notyData.loading) {
                    window.notyData.loading.close();
                    window.notyData.loading = null;
                }

                window.notyData.loadingQty = 0;
            }

            noty({ text: 'Done', type: 'success' });

            return response || $q.when(response);
        },

        responseError: function(rejection) {
            if (! rejection.config) {
                noty({ text: 'System error', type: 'danger' });
                console.log(rejection.message);
                return
            }

            if (isSystemCall(rejection.config.method, rejection.config.url)
                || rejection.config.method.toUpperCase() == 'GET') return $q.reject(rejection);

            window.notyData.loadingQty--;
            if (window.notyData.loadingQty < 1) {
                window.notyData.loading.close();
                window.notyData.loading = null;
                window.notyData.loadingQty = 0;
            }

            switch (rejection.status) {
                case 400:
                    noty({ text: 'Validation error', type: 'warning' });
                    break;
                case 409:
                    noty({ text: 'Somebody make conflicting changes', type: 'warning' });
                    break;
                case 500:
                    noty({ text: 'System error', type: 'danger' });
                    break;
            }

            return $q.reject(rejection);
        }
    };
});
;angular.module('JiNGle.directives').directive('jibreadcrumbs', function() {
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
;/**
 * Attributes:
 *  id - [Optional] identifier of item (can be generated randomly)
 *  name - [Optional] name of item
 *  suggestions - [Optional] suggested values of text input (only for text input)
 *  label - [Optional] label of item
 *  type - [Optional] type of input item
 *  value - [Optional] value/model link to object
 *  options - [Optional/only when type = select] options of drop down list
 *  disabled - [Optional] is input field disabled
 *  validation - [Optional] validation rules of value, is array of objects
 *      { rule: '<name-of-rule>', value: '<value-of-rule>', message: '<error-message>' }
 *      { rule: 'min', value: '1', message: 'Value should be greater than 1.' }
 *
 * Validation rules:
 *  min - Minimum value (For numbers)
 *  max - Maximum value (For numbers)
 *  same - Same value as in another field
 *  pattern - Value match to regex pattern
 *  require - Value is not empty
 *  email - Value is email
 *  phone - Value is phone
 *  name - Value is name
 *  date - Value is date
 */
angular.module('JiNGle.directives').directive('jifield', function($filter) {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'FieldDirective.html',
        transclude: true,

        scope: {
            id: '@',
            name: '@',
            label: '@',
            type: '@',
            ngModel: '=',
            wrong: '=',
            options: '=?',
            disabled: '=?',
            validation: '=?'
        },

        link: function($scope) {
            $scope.id = $scope.id || $scope.name || 'field_' + Math.floor((Math.random() * 10000000) + 1);
            $scope.type = $scope.type || 'text';

            var translator = $filter('i18n');

            $scope.printValue = function(option) {
                if (! option) return;
                return option.value || option.name || option.code || option
            };

            $scope.printName = function(option) {
                if (! option) return;
                if (option.name) return option.name;
                if (option.code) return translator(option.code);

                return option.value || option.code || option.code || option;
            };

            $scope.type = ['select', 'textarea', 'html'].indexOf($scope.type) == -1 ? 'text' : $scope.type;
            $scope.fieldLength = ['textarea', 'html'].indexOf($scope.type) == -1 ? 8 : 5;
        }
    };
});
;/**
 * Attributes:
 *  id - [Optional] identifier of item (can be generated randomly)
 *  disabled - [Optional] is input field disabled
 *  cancel - [Optional/required for not disabled forms] url for cancel action
 *  save - [Optional/required for not disabled forms] function on submit action
 */
angular.module('JiNGle.directives').directive('jiform', function() {
    'use strict';

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: JiNGle.viewPath + 'FormDirective.html',
        transclude: true,

        scope: {
            id: '@id',
            disabled: '=disabled',
            cancel: '@cancel',
            save: '&save'
        },

        link: function($scope, element, attrs) {
            $scope.saveSet = typeof attrs['save'] !== 'undefined';

            jQuery(document).bind('keydown', function(e) {
                if (! e.ctrlKey || e.which !== 83) return true;
                e.preventDefault();

                $scope.save();

                return false;
            });
        }
    }
});;angular.module('JiNGle.directives').directive('jiservertable', function($http) {
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

            $scope.isSortedAsc = function(field) { 
                return $scope.collection.sortOrder && $scope.collection.sortOrder[field] === 1; 
            };
            $scope.isSortedDesc = function(field) { 
                return $scope.collection.sortOrder && $scope.collection.sortOrder[field] === -1; 
            };

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

            $scope.cellStyle = function(row, column) {
                if (column.style) {
                    if (column.field) return column.style(row[column.field]);

                    return column.style(row);
                }

                return {};
            };

            $scope.cellFormat = function(row, column) {
                if (column.format) {
                    if (column.field) return column.format(row[column.field]);

                    return column.format(row);
                }

                return row[column.field];
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
;angular.module('JiNGle.directives').directive('jitable', function($filter) {
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
;angular.module('JiNGle.filters').filter('ji_checkmark', function() {
    'use strict';

    return function(input, no, yes) {
        return input ? yes || '✓' : no || '✘';
    };
});;angular.module('JiNGle.filters').filter('i18n', function($parse, I18nService) {
    'use strict';

    return function(key) {
        var translation = $parse(key)(I18nService.getCache());

        if (translation)
            for (var i = 1; arguments.length > i; i++)
                translation = translation.split('{' + (i - 1) +  '}').join(arguments[i]);

        return  translation;
    };
});
;angular.module('JiNGle.filters').filter('ji_inline', function() {
    'use strict';

    return function(input, maxLength, side) {
        if (typeof input !== 'string') return input;

        var short = input.words().join(' ');
        if (! maxLength || short.length <= maxLength) return short;

        return short.truncateOnWord(maxLength - 3, side);
    };
});
;angular.module('JiNGle.filters').filter('range', function() {
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
