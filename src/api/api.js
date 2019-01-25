import axios from '../axios/axios.js'
import qs from 'qs'
export const base = 'http://127.0.0.1:8000/processMiningPlatform/';
//请求登录
export const requestLogin = params=>{
	return axios.post(`${base}/userAction/adminLogin`,qs.stringify(params)).then(res=>res.data).catch(function(error){
	})
}
//获取基本用户
export const getBasicUser = params=>{
  return axios.post(`${base}/userAction/getBasicUser`, qs.stringify(params)).then(res => res.data).catch(function (error) {
  })
}
//添加用户
export const addUser = params=>{
  return axios.post(`${base}/userAction/addUser`, qs.stringify(params)).then(res => res.data).catch(function (error) {
  })
}
//添加用户
export const deleteUser = params=>{
  return axios.post(`${base}/userAction/deleteUser`, qs.stringify(params)).then(res => res.data).catch(function (error) {
  })
}
//查询算法
export const queryAlgorithms = params => {
  return axios.get(`${base}/algorithmAction/listAll`, {}).then(res => res.data).catch(function (error) {
  })
}
//上传Jar插件获取其中的包名，类名，方法等信息,记：参数params不需要转换成json
export const upload = params => {
    return axios.post(`${base}/algorithmAction/upload`,params).then(res=>res.data).catch(function (error) {
    })
}
//删除算法
export const deleteAlgorithm = params => {
  return axios.get(`${base}/algorithmAction/delete`, {}).then(res => res.data).catch(function (error) {
  })
}

//设置算法是否可用
export const updateAlgorithmAvailable = params=>{
	return axios.post(`${base}/algorithmAction/updateAlgorithmAvailable`, qs.stringify(params)).then(res => res.data).catch(function (error) {
  })
}

