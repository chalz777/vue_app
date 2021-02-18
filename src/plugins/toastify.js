import Vue from 'vue';
import VueToastify from "vue-toastify";

Vue.use(VueToastify, {
    position: "bottom-center",
    theme: "dark",
    withBackdrop: true,
    canTimeout: true,
    errorDuration: 1000,
    successDuration: 1000,
    warningInfoDuration: 1000,
    alertInfoDuration: 500,
    duration: 500,
});


export default ({
});
