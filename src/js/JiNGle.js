JiNGle = JiNGle || { };

JiNGle.rootPath = null;
JiNGle.scriptPath = null;
JiNGle.viewPath = null;

JiNGle.arguments = {};

JiNGle.init = function() {
    var scripts = document.getElementsByTagName('script');
    var currentPath = scripts[scripts.length-1].src;

    this.rootPath = currentPath.substring(0, currentPath.lastIndexOf('/js/') + 1);

    this.scriptPath = this.rootPath + 'js/';
    this.viewPath = this.rootPath + 'views/';

    var indexOfArg = currentPath.lastIndexOf('#?');
    if (indexOfArg) {
        currentPath.substring(indexOfArg + 2, currentPath.length - 1)
            .split('&')
            .forEach(function(part) {
                var values =part.split('=');
                JiNGle.arguments[decodeURIComponent(values[1])] = decodeURIComponent(values[0]);
            });
    }

    if (this.arguments['automport'] == 'true') this.import(this.components);
};

JiNGle.init();
