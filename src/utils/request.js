import axios from 'axios';
import { common } from './common.js';
import config from '../common/basic-configuration';

//process.env.OTHER_API
const BASE_API= config.BASE_API;
const OTHER_API= config.OTHER_API;

export default {
    get: async(url, param,state) => {
        if(state){
            url = OTHER_API + url; 
        } else{
            url = BASE_API + url;
        }
        if (param) {
            url += '?' + common.serialize(param);
        }
        let rconfig = {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': common.getToken(),
            },
            mode: 'cors',
            cache: 'force-cache',
        };
        const response = await axios.get(url, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    post: async(url, data = {},state) => {
        if(state){
            url = OTHER_API + url;
        }
        else{
            url = BASE_API + url;
        }
        let rconfig = {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                // 'Accept': 'application/json',
                // 'Content-type': 'application/json',
                'token': common.getToken(),
                // 'withCredentials': true,
            },
            mode: 'cors',
            cache: 'force-cache'
        };
        const response = await axios.post(url, data, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    delete: async(url, param,state) => {
        if(state){
            url = OTHER_API + url; 
        } else{
            url = BASE_API + url;
        }
        if (param) {
            url += '?' + common.serialize(param);
        }
        let rconfig = {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': common.getToken(),
            },
            mode: 'cors',
            cache: 'force-cache',
        };
        const response = await axios.delete(url, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
    put: async(url, data = {},state) => {
        if(state){
            url = OTHER_API + url;
        }
        else{
            url = BASE_API + url;
        }
        let rconfig = {
            credentials: 'include',
            method: 'PUT',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                // 'Accept': 'application/json',
                // 'Content-type': 'application/json',
                'token': common.getToken(),
                // 'withCredentials': true,
            },
            mode: 'cors',
            cache: 'force-cache'
        };
        const response = await axios.put(url, data, rconfig);
        const result = response.data;
        if (result.code === 500) {
        }
        return result;
    },
};

axios.interceptors.response.use(function(response) {
    return response;
}, function(err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误(400)';
                break;
            case 401:
                err.message = '登录失效，请重新登录(401)';
                router.push('/login');
                break;
            case 403:
                err.message = '拒绝访问(403)';
                break;
            case 404:
                err.message = '请求出错(404)';
                break;
            case 408:
                err.message = '请求超时(408)';
                break;
            case 500:
                err.message = '服务器错误(500)';
                break;
            case 501:
                err.message = '服务未实现(501)';
                break;
            case 502:
                err.message = '网络错误(502)';
                break;
            case 503:
                err.message = '服务不可用(503)';
                break;
            case 504:
                err.message = '网络超时(504)';
                break;
            case 505:
                err.message = 'HTTP版本不受支持(505)';
                break;
            default:
                err.message = `连接出错(${err.response.status})!`;


        }
    } else {
        // console.log('error:',err);
        err.message = '连接服务器失败!'
    }
    return Promise.reject(err);
});
