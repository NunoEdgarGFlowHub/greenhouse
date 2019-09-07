import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Data source:
// https://github.com/stefangabos/world_countries/blob/master/data/en/countries.json
export default new Vuex.Store({
  state: {
    lang: 'en',
    userChecked: false,
    user: null,
    logo: '/images/application_logo_greenhouse.svg',
    allComponentCategories: ['general', 'weather'],
    allComponentTypes: ['botengine', 'service', 'channel'],
    allComponentStatuses: ['enabled', 'disabled'],
    allPropertyInputTypes: ['select', 'text'],
    menu: [
      {
        text: 'app.dashboard',
        icon: 'outline-dashboard-24px@2x.svg',
        target: 'dashboard',
      },
      {
        text: 'app.marketplace',
        icon: 'outline-marketplace-24px.svg',
        target: 'marketplace',
      },
      {
        text: 'app.my_products',
        icon: 'outline-my-products-24px.svg',
        target: 'botsList',
      },
      {
        text: 'app.privacy',
        icon: 'outline-security-24px@2x.svg',
        target: 'privacy',
      },
    ],
    apps: [
      {
        text: 'apps.accounts',
        icon: 'outline-app-24px@2x.svg',
        url:  (process.env.NODE_ENV === 'production'? 'https://accounts.seedtoken.io': 'https://127.0.0.1:9000') + `/{{ locale }}/sign-in`,
      },
      {
        text: 'apps.wallet',
        icon: 'outline-app-24px@2x.svg',
        url:  (process.env.NODE_ENV === 'production'? 'https://wallet-dev.seedtoken.io': 'https://127.0.0.1:9001') + `/{{ locale }}/dashboard`,
      },
    ],
  },
  getters: {
    /* eslint-disable no-shadow */
    lang: state => state.lang,
    apps: state => state.apps,
    user: state => state.user,
    userChecked: state => state.userChecked,
    menu: state => state.menu,
    logo: state => state.logo,
    allComponentCategories: state => state.allComponentCategories,
    allComponentTypes: state => state.allComponentTypes,
    allComponentStatuses: state => state.allComponentStatuses,
    allPropertyInputTypes: state => state.allPropertyInputTypes,
  },
  mutations: {
    SET_LANG(state, params) {
      state.lang = params.lang;
    },
    SET_USER(state, params) {
      state.user = params.user;
    },
    SET_USER_CHECKED(state, params) {
      state.userChecked = params.userChecked;
    },
  },
  actions: {
    setLang({ commit }, params) {
      commit('SET_LANG', params);
    },
    setUser({ commit }, params) {
      commit('SET_USER', params);
    },
    setUserChecked({ commit }, params) {
      commit('SET_USER_CHECKED', params);
    },
  },
});
