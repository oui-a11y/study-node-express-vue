import axios from 'axios';
import store from './../store/index';


let defaultAjax = {
  showLoading: true
};
let needLoadingRequestCount = 0;

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   console.log(config);
//   if (config.method == 'get') {
//     if (config.config.showLoading) {
//       showFullScreenLoading();
//     }
//
//   } else if (config.method == 'post') {
//     if(config.showLoading){
//       showFullScreenLoading();
//     }
//   }
//
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });
//
// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   if (response.config.method == 'get') {
//     if (response.config.showLoading) {
//       closeFullScreenLoading();
//     }
//
//   } else if (response.config.method == 'post') {
//     if(response.config.showLoading){
//       closeFullScreenLoading();
//     }
//   }



// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log(config);
  showFullScreenLoading();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  closeFullScreenLoading();
  console.log(response);
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export function getHttp(url, params = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params,
      config:{...defaultAjax, ...config}
    },).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

export function postHttp(url, params = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {...defaultAjax, ...config}).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

function closeFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

function startLoading() {
  store.commit('SHOW_LOADING');
}

function endLoading() {
  store.commit('HIDE_LOADING');
}


