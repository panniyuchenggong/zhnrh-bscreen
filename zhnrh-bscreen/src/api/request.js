import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { encryptDes, decryptDes } from '../plugins/des';

import { ElLoading, ElMessage } from 'element-plus';
//测试
export let pubKey =
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCt8gwr42wV+O8EVRtEBO/iHmH2USzbeVtl9JKEw/j0f3LvK3QM4mC/SXLKBpjjAKJCPxFR/nRGEcvhcJ5hhSbdL4TtkkS25+hu5Az0duqytNoxarq8yGRhWWtgq4VmjFC3HMpOKihuobH8ugJei9WrgLHZfTqlh1bsW824xDuD3wIDAQAB';

//生产
//export  let priKey =
// 	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCe1sGtF4nn2x8xFbkRI6TYV/g5yfBV+nkfOCR6SKCr+hYo/eEtQJoFYZEMfKUvSQt1wy6hrCkHgN330aRivZSrXZUbqvddRBtO8/mhnBq9rlsI7N7G+M1BS2zRUfZ0+LsAZSjMWHm76tppV0szMpErWojN07gwM+X+uApCXWGiNQIDAQAB';

const instance = axios.create({
	// baseURL: import.meta.env.VITE_API_URL,
	timeout: 5000,
	headers: { 'X-Custom-Header': 'foobar', 'content-type': 'application/json' },
});

let loading;
// 正在请求的数量
let requestCount = 0;
// 显示loading
const showLoading = () => {
	if (requestCount === 0 && !loading) {
		loading = ElLoading.service({
			fullscreen: true,
			lock: true,
			text: 'Loading',
			background: 'rgba(0, 0, 0, 0.7)',
		});
	}
	requestCount++;
};
// 隐藏loading
const hideLoading = () => {
	requestCount--;
	if (requestCount === 0) {
		loading.close();
	}
};
// 生成随机字符串
const randomString = (len) => {
	len = len || 32;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
};

let str = '',
	des_str = '',
	rsa_str = '';
str = randomString(16); // des秘钥
// 请求拦截器
instance.interceptors.request.use(
	(config) => {
		const reqConfig = config;
		let encryptor = new JSEncrypt(); // 创建加密对象实例
		encryptor.setPublicKey(pubKey); //设置公钥
		const _data = JSON.stringify(reqConfig.data);
		console.log(`请求的url----${reqConfig.url}======请求参数param:--------${_data}`);

		des_str = encryptDes(_data, str); // des加密
		rsa_str = encryptor.encrypt(str); // rsa加密
		reqConfig.data = {
			key: rsa_str,
			value: des_str,
		};
		// console.log(reqConfig.data);
		// showLoading()
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		//   const token = window.localStorage.getItem('token')
		//   if (token) {
		//     reqConfig.headers.Authorization = token
		//   }
		// 若请求方式为post，则将data参数转为JSON字符串
		//   if (reqConfig.method.toLocaleUpperCase() === 'POST') {
		//     reqConfig.data = JSON.stringify(reqConfig.data)
		//   }
		return reqConfig;
	},
	(error) =>
		// 对请求错误做些什么
		Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
	(response) => {
		response.data = JSON.parse(decryptDes(response.data, str));
		// console.log('res========', response);
		// hideLoading()
		// 响应成功
		return response.data;
	},
	(error) => {
		// 响应错误
		if (error.response && error.response.status) {
			const { status } = error.response;
			let message = '';
			const actions = {
				400: '请求错误',
				401: '请求错误',
				404: '请求地址出错',
				408: '请求超时',
				500: '服务器内部错误!',
				501: '服务未实现!',
				502: '网关错误!',
				503: '服务不可用!',
				504: '网关超时!',
				505: 'HTTP版本不受支持',
				20000: '请求失败',
			};
			message = actions[status] ? actions[status] : actions['20000'];
			ElMessage.error(message);
			return Promise.reject(error);
		}
		return Promise.reject(error);
	}
);

const request = (url, data = {}, isloading = false, method = 'POST') => {
	!isloading && showLoading(); //todo 也可以放到请求拦截的里面中，这里更方便的进行控制

	return new Promise((resolve, reject) => {
		instance({
			method: method,
			url: url,
			data: data,
		})
			.then((res) => {
				resolve(res);
			})
			.catch((msg) => {
				console.log('失败-------', msg);
				ElMessage.error(msg);
				reject(msg);
			})
			.finally(() => {
				!isloading && hideLoading(); //todo 这个可以放到响应拦截器中，这里进行方便的控制
			});
	});
};

export default request;
