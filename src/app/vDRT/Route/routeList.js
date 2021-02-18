import { routeList } from '../VueComponents/route-list.js'

window.vm = new Vue({
    el: '#app',
    methods: {
        showIntro: function () { },
        hideIntro: function () { }
    },
    components: { routeList },
    vuetify: new Vuetify()
});


