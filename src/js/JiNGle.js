JiNGle = JiNGle || { };

JiNGle.components = { // Components with value 'true will be auto imported
    directives: {
        'BreacrumbsDirective.js': true,
        'FieldDirective.js': true,
        'FormDirective.js': true,
        'TableDirective.js': true
    },

    filters: {
        'checkmarks.js': true,
        'inline.js': true
    },

    interceptors: {
        'HttpInterceptor.js': true
    }
};

JiNGle.autoimport = false;

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

JiNGle.import = function(target, path) {
    path = path || this.scriptPath;

    if (typeof target === "string") {
        this.requires(path + target);
        return;
    }

    if (typeof target === "boolean") {
        if (target) this.requires(path);
        return;
    }

    if (typeof target === "object") {
        Object.keys(target).forEach(function(key) {
            JiNGle.requires(target[key], path + key + (typeof target[key] === 'boolean' ? '' : '/'))
        });
    }

};

JiNGle.requires = function(target) {
    var imported = document.createElement('script');
    imported.src = target;
    document.head.appendChild(imported);
};

JiNGle.init();