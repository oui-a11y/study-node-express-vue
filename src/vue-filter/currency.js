import Vue from 'vue';
//金额格式化
import currency from './../util/currency';

Vue.filter(currency,currency);
