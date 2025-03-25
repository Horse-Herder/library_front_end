// 对axios进行二次封装
import axios from 'axios';
import { MessageBox } from 'element-ui';
import router from '@/router';

// 封装操作 cookie 的函数
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

// requests就是axios，只不过稍微配置一下
const requests = axios.create({
    // 配置对象
    // 基础路径，发送请求时，路径当中会出现api
    baseURL: '/api',
    // 代表请求超时的时间
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
});

// 请求拦截器：发送请求前做一些事情
requests.interceptors.request.use((config) => {
    // config:配置对象，headers请求头很重要
    const token = getCookie('token');
    if (token) {
        if (config.url.includes('register') || config.url.includes('login')) {
            // 注册、登录接口不需要携带 token
            return config;
        }
        // 其他接口请求要将 token 写入 authorization 中
        config.headers.Authorization = `${token}`;
    }
    return config;
});

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 登录成功将 token 写入 cookie 中
    if ( res.data && res.data.token) {
        setCookie('token', res.data.token, 1); //
        setCookie('isAdmin', res.data.isAdmin, 1); // 假设 token 有效期为 7 天
        setCookie('username', res.data.userName, 1); // 假设 token 有效期为 7 天
    }
    // 成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
    return res.data;
}, (err) => {
    if (err.response && err.response.data) {
        const { error_code, status, msg } = err.response.data;
        if (error_code === 0 && status === 403) {
            MessageBox.alert(msg, '错误提示', {
                confirmButtonText: '确定',
                callback: () => {
                    // 返回登录注册页面
                    router.push('/login');
                },
            });
        }
    }
    // 响应失败的回调函数
    return Promise.reject(new Error('fail'));
});

export default requests;
