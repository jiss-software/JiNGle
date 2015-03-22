var JiNGle = {
    rootPath: null,
    scriptPath: null,
    viewPath: null
};

(function() {
    var scripts = document.getElementsByTagName('script');
    var currentPath = scripts[scripts.length-1].src;

    JiNGle.rootPath = currentPath.substring(0, currentPath.lastIndexOf('/js/') + 1);

    JiNGle.scriptPath = JiNGle.rootPath + 'js/';
    JiNGle.viewPath = JiNGle.rootPath + 'views/';
})();

angular.module('JiNGle.directives', []);
angular.module('JiNGle.filters', []);
angular.module('JiNGle.interceptor', []);
