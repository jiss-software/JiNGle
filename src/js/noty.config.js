// Configuration of notification
jQuery.noty.defaults = {
    theme: 'jiss',
    dismissQueue: true,
    template: '<span class="noty_text"></span>',
    animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500
    },

    type: 'info',
    layout: 'topRight',
    modal: false,
    timeout: 10000,
    force: false,
    maxVisible: 3,
    killer: false,
    closeWith: ['click'],

    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {}
    },

    buttons: false
};

jQuery.noty.themes.jiss = {
    name: 'jiss',
    modal: {
        css: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 10000,
            opacity: 0.6,
            display: 'none',
            left: 0,
            top: 0
        }
    },

    style: function() {
        this.$bar.css({
            overflow: 'hidden',
            padding: '10px',
            'margin-right': '20px !important'
        });

        this.$bar.addClass('alert');
        this.$bar.addClass('alert-' + this.options.type);
    },

    callback: {
        onShow: function() {
            jQuery('#noty_topRight_layout_container').css({
                'margin-right': '10px'
            });
            jQuery.noty.themes.defaultTheme.helpers.borderFix.apply(this);
        },
        onClose: function() { jQuery.noty.themes.defaultTheme.helpers.borderFix.apply(this); }
    }
};