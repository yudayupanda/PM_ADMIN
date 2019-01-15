import axios from '../axios/axios.js'
import qs from 'qs'
let base = 'http://127.0.0.1:8000/processMiningPlatform/';
// 超时时间
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//查询挖掘算法
export const queryAlgorithms = params => {
  return axios.get(`${base}/algorithmAction/listAll`, {}).then(res => res.data).catch(function (error) {
  })
}
//上传Jar插件获取其中的包名，类名，方法等信息,记：参数params不需要转换成json
export const getJarInfo = params => {
    return axios.post(`${base}/algorithmAction/parseJar`,params).then(res=>res.data).catch(function (error) {
    })
}