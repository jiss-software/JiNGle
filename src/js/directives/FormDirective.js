/**
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
});