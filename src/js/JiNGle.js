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
angular.module('JiNGle.interceptor', []);