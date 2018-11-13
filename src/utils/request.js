/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken, getIp, getPort, getExpire, getExpire2, removeExpire } from '@/utils/auth'
// create an axios instance
let ip_set = store.getters.ipconfig
let port = store.getters.port
let config_set = 'http://' + ip_set + ':' + port
let ipConfig = getIp()
let portConfig = getPort()
let serviceConfig = 'http://' + ipConfig + ':' + portConfig

let timeStamp = getExpire()
let refreshTimeStamp = getExpire2()
let qs = require('qs')
let userRoleInfo
const service = axios.create({
  baseURL: serviceConfig // api的base_url

})

// request interceptor
service.interceptors.request.use (config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  // 头部信息内包含userBoard 则为用户看板
  if (config.headers.roleInfo) {
    if(config.headers.roleInfo == 'userBoard') {
      userRoleInfo = 'userBoard'
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    timeStamp = getExpire()
    // 如果为用户看板则直接返回response
    if (userRoleInfo == 'userBoard') {
      console.log('res success')
      return response
    } else {
      if (timeStamp && timeStamp < (new Date()) / 1000){      //目前是让过期就回到登录页面
        console.log("超过刷新token了，重新登录----------");
        Vue.prototype.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeExpire('timeStamp')
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }
      return response
    }
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
    //  const res = response.data;
    //     if (res.code !== 20000) {
    //       Message({
    //         message: res.message,
    //         type: 'error',
    //         duration: 5 * 1000
    //       });
    //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //           confirmButtonText: '重新登录',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         }).then(() => {
    //           store.dispatch('FedLogOut').then(() => {
    //             location.reload();// 为了重新实例化vue-router对象 避免bug
    //           });
    //         })
    //       }
    //       return Promise.reject('error');
    //     } else {
    //       return response.data;
    //     }
  error => {
    if(error.response.data.error_description&&error.response.data.error_description.indexOf('Access token expired') >= 0){
      Vue.prototype.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeExpire('timestamp')
        store.dispatch('FedLogOut').then(() => {
          location.reload();// 为了重新实例化vue-router对象 避免bug
        });
      })
    }
    console.log('err' + error)// for debug
    /*  Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })*/
    return Promise.reject(error)
  })

export default service
