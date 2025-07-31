import Vue from 'vue';

const SyncStatus = Object.freeze({
    STATUS_IDLE: 0,
    STATUS_BUSY: 1,
});

export default {
    namespaced: true,

    state: {
        namedQueues: {},
        namedQueuesStates: {},
    },

    mutations: {
        addToQueue(state, { queue_name, method, resolve, reject }) {
            if (!state.namedQueues[queue_name]) {
                // Init the queue and its state
                Vue.set(state.namedQueues, queue_name, []);
                Vue.set(state.namedQueuesStates, queue_name, SyncStatus.STATUS_IDLE);
            }
            state.namedQueues[queue_name].push({ method, resolve, reject });
        },
        shiftQueue(state, { queue_name }) {
            state.namedQueues[queue_name].shift();
        },
        setQueueState(state, { queue_name, queue_state }) {
            Vue.set(state.namedQueuesStates, queue_name, queue_state);
        },
    },

    actions: {
        addToQueue({ commit, dispatch }, { queue_name, method }) {
            const result = new Promise((resolve, reject) => {
                // This custom promise is resolved by queue processor
                commit('addToQueue', { queue_name, method, resolve, reject });
            });
            dispatch('processQueue', { queue_name });
            return result;
        },
        processQueue({ state, commit, dispatch }, { queue_name }) {
            // If being processed, the processing will continue on its own until the queue is empty
            if (state.namedQueuesStates[queue_name] === SyncStatus.STATUS_IDLE) {
                commit('setQueueState', { queue_name, queue_state: SyncStatus.STATUS_BUSY });
                if (state.namedQueues[queue_name].length > 0) {
                    const firstEl = state.namedQueues[queue_name][0];
                    commit('shiftQueue', { queue_name });
                    firstEl
                        .method()
                        .then(res => {
                            firstEl.resolve(res);
                        })
                        .catch(err => {
                            firstEl.reject(err);
                        })
                        .finally(() => {
                            commit('setQueueState', { queue_name, queue_state: SyncStatus.STATUS_IDLE });
                            dispatch('processQueue', { queue_name });
                        });
                } else {
                    commit('setQueueState', { queue_name, queue_state: SyncStatus.STATUS_IDLE });
                }
            }
        },
    },
};
