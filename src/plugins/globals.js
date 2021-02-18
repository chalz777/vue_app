import Vue from 'vue';

import DataAccess from '@/assets/js/dataAccess.js';  




export default ({
    install(Vue, options) {
        Vue.component('api', DataAccess);
        Vue.prototype.$vData = DataAccess;
        Vue.prototype.$vRoot = window.location.origin;

        //window.location.origin + this.$route.path
        
        //Vue.prototype.a = '123';
        Vue.getRoute = function () {
            DataAccess.getRoutedDocuments();
        }
        Vue.prototype.$surname = 'Smith'
    }

});
