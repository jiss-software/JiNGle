JiNGle = JiNGle || {};

JiNGle.rootPath = null;
JiNGle.scriptPath = null;
JiNGle.viewPath = null;

(function() {
    var scripts = document.getElementsByTagName('script');
    var currentPath = scripts[scripts.length-1].src;

    this.rootPath = currentPath.substring(0, currentPath.lastIndexOf('/js/') + 1);

    this.scriptPath = this.rootPath + 'js/';
    this.viewPath = this.rootPath + 'views/';
})();
