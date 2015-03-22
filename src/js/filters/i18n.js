angular.module('JiNGle.filters').filter('i18n', function($parse, I18nService) {
    'use strict';

    return function(key) {
        var translation = $parse(key)(I18nService.getCache());

        if (translation)
            for (var i = 1; arguments.length > i; i++)
                translation = translation.split('{' + (i - 1) +  '}').join(arguments[i]);

        return  translation;
    };
});
