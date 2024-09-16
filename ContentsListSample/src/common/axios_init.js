import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import axios from 'axios';

Vue.use(VueProgressBar, {
    color: '#007bbb',
    failedColor: 'red',
    thickness: '4px',
});

let concurrent_calls = 0;

axios.interceptors.request.use(
    function(config) {
        concurrent_calls++;
        Vue.prototype.$Progress.start(5000);
        Vue.prototype.$Progress.set(5);
        return config;
    },
    function(error) {
        concurrent_calls--;
        Vue.prototype.$Progress.fail();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function(response) {
        concurrent_calls--;
        Vue.prototype.$Progress.set(50);
        setTimeout(() => {
            // The delay is required because if requests are chained, the finish will execute during the same render call as start, resulting in progress bar not starting
            if (concurrent_calls == 0) {
                Vue.prototype.$Progress.finish();
            }
        }, 10);
        return response;
    },
    function(error) {
        concurrent_calls--;
        Vue.prototype.$Progress.fail();
        return Promise.reject(error);
    }
);
