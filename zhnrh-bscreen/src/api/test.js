import request from './request';
export const test = (data) => {
	// return request('/api/get', 'get');
	return request('/api/GET/getIndexFunZoneList', data);
};
