/**
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

        scope: {
            id: '@',
            name: '@',
            label: '@',
            type: '@',
            value: '=',
            wrong: '=',
            options: '=',
            configure: '=',
            disabled: '=',
            validation: '='
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

            $scope.fieldLength = $scope.type == 'html' ? 8 : 5;

            $scope.configure = $scope.configure || {
                inline: false,
                plugins : 'advlist autolink link image lists charmap print preview',
                skin: 'lightgray',
                theme : 'modern'
            };
        }
    };
});
