import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        limit: [],
        processBar: {
            process: null,
            hide: true
        }
    },
    mutations: {
        LOGIN(state, limit) {
            window.sessionStorage.limit = JSON.stringify(limit);
            state.hasLogin = true;
            state.limit = limit;
        },
        LOGOUT(state) {
            state.hasLogin = false;
            state.limit = [];
        },
        PROCESSBARBEGIN(state, value) {
            state.processBar.hide = false;
            state.processBar.process = value + 'rem';
        },
        PROCESSBAREND(state) {
            state.processBar.process = '10rem';
        },
        PROCESSBARHIDE(state) {
            state.processBar.hide = true;
        }
    },
    actions: {
        processBarBegin(ctx) {
            var ran = ~~(Math.random() * 30).toFixed(2);
            var t = (ran + 2) / 10;
            ctx.commit('PROCESSBARBEGIN', t);
            setTimeout(function() {
                ctx.commit('PROCESSBARBEGIN', t + 2);
            }, 800);
        },
        processBarEnd(ctx) {
            ctx.commit('PROCESSBAREND');
            setTimeout(function() {
                ctx.commit('PROCESSBARHIDE');
            }, 800);
        },
        login(ctx, limit) {
            ctx.commit('LOGIN', limit);
        },
        logout(ctx) {
            ctx.commit('LOGOUT');
            window.sessionStorage.removeItem('limit');
            window.sessionStorage.removeItem('timeStamp');
            window.location.href="//"+window.location.hostname;
        }
    }
});

export default store;