var jQuery = require('jquery'),
    UIkit = require('uikit-rtl'),
    Vue = require('vue'),
    OudyVue = {
        beforeCompile: function () {
            if(jQuery(this.$el).attr('vue-data'))
                this.$data = jQuery.extend({}, this.$data, JSON.parse(jQuery(this.$el).attr('vue-data')));
        },
        attached: function () {
            var component = this;
            jQuery(component.$el).find('form[oudyview-confirm]').each(function() {
                jQuery(this).data('serialize', jQuery(this).serialize());
            });
            if(require.cache[require.resolveWeak('oudyview')]) {
                var OudyView = require('oudyview');
                jQuery(component.$el).find('[oudyview-confirm="reload"]').each(function () {
                    OudyView.reloadOnClose = true;
                });
            }
            jQuery(component.$el).removeClass('uk-invisible');
            setTimeout(function() {
                jQuery(component.$el).find('[data-uk-switcher]').each(function() {
                    jQuery(this).data('switcher').show(jQuery(this).data('switcher').options.active);
                });
            });
            UIkit.trigger('domready.uk.dom');
            jQuery(window).resize();
        }
    };
Vue.config.devtools = false;
module.exports = {
    init: function() {
        (function(UI){
            "use strict";
            UI.component('vue', {
                boot: function() {
                    UI.ready(function(context) {
                        UI.$('[vue]', context).each(function(){
                            var ele = UI.$(this);
                            if(!ele.data('vue'))
                                UI.vue(ele);
                        });
                    });
                },
                init: function() {
                    var Component = Vue.component(this.element.attr('vue'));
                    if(!Component)
                        Component = Vue.extend(OudyVue);
                    this.element.data('vue', new Component({
                        el: this.element[0]
                    }));
                }
            });
        })(UIkit);
    },
    component: function(name, component) {
        return Vue.component(name, this.extend(component));
    },
    extend: function(component) {
        if(!component)
            component = {};
        return jQuery.extend({}, OudyVue, component);
    }
};