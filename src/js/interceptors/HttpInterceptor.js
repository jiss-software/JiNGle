window.notyData = {
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
