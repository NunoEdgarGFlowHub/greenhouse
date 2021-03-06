import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'seed-theme/src/styles/seed.scss';
import Icon from 'seed-theme/src/components/Icon.vue';
import HelpTooltip from 'seed-theme/src/components/HelpTooltip.vue';
import InputText from 'seed-theme/src/components/InputText.vue';
import InputTextarea from 'seed-theme/src/components/InputTextarea.vue';
import InputPassword from 'seed-theme/src/components/InputPassword.vue';
import InputSelect from 'seed-theme/src/components/InputSelect.vue';
import InputCheckbox from 'seed-theme/src/components/InputCheckbox.vue';
import LocaleChanger from 'seed-theme/src/components/LocaleChanger.vue';
import IconInsideInput from 'seed-theme/src/components/IconInsideInput.vue';
import IconInsideTextarea from 'seed-theme/src/components/IconInsideTextarea.vue';
import ValidationBox from 'seed-theme/src/components/ValidationBox.vue';
import ValidationMessages from 'seed-theme/src/components/ValidationMessages.vue';
import Oops from 'seed-theme/src/components/Oops.vue';
import LoadingCircle from 'seed-theme/src/components/LoadingCircle.vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';


// Register global components
Vue.component('icon', Icon);
Vue.component('help-tooltip', HelpTooltip);
Vue.component('input-select', InputSelect);
Vue.component('icon-inside-input', IconInsideInput);
Vue.component('icon-inside-textarea', IconInsideTextarea);
Vue.component('input-text', InputText);
Vue.component('input-textarea', InputTextarea);
Vue.component('input-password', InputPassword);
Vue.component('input-checkbox', InputCheckbox);
Vue.component('locale-changer', LocaleChanger);
Vue.component('validation-box', ValidationBox);
Vue.component('validation-messages', ValidationMessages);
Vue.component('oops', Oops);
Vue.component('loading-circle', LoadingCircle);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.prototype.axios = axios;

// Register function to normalize mongoose validation messages
Vue.prototype.normalizeErrors = (errors) => {
  const data = [];
  const keys = Object.keys(errors.data.errors);
  const values = Object.values(errors.data.errors);
  for (let i = 0; i < keys.length; i += 1) {
    data[keys[i]] = [{ msg: values[i].message }];
  }
  return data;
};

// Global filters
Vue.filter('toCryptoCurrency', (numericValue) => {
  const value = numericValue.toString();
  let sInt = '';
  let sDec = '';
  let thousandsSeparator = ',';
  let decimalSeparator = '.';
  if (!value.includes('.')) {
    sInt = value;
  } else {
    const parts = value.split('.');
    sInt = parts[0]; // eslint-disable-line prefer-destructuring
    sDec = parts[1]; // eslint-disable-line prefer-destructuring
  }
  if (i18n.locale === 'es') {
    thousandsSeparator = '.';
    decimalSeparator = ',';
  }
  let s = sInt.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandsSeparator}`);
  if (sDec !== '') {
    s += decimalSeparator + sDec;
  }
  return s;
  // return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
});


Vue.filter('toDate', (value, format) => {
  const date = new Date(value);
  let locale = 'en-US';
  if (i18n.locale === 'es') {
    locale = 'es-AR';
  }
  switch (format) {
    case 'short':
      return date.toLocaleDateString(locale);
    default:
      return value;
  }
});

Vue.filter('toCurrency', (value, nDecimals) => {
  if (!value) return '';
  if (typeof value !== 'number') {
    return value;
  }
  let decimals = nDecimals;
  if (!decimals) {
    decimals = 0;
  }
  if (typeof decimals !== 'number') {
    decimals = 0;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value);
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
