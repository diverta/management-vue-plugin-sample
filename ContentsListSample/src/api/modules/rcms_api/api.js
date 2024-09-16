import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import { processError } from '../../utils';

const controller_uri = '/management/rcms_api/api_list/';

export function do_list(params) {
    params = { ...params, MODE: 'LIST_API' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .then(data => {
            data.api_list.forEach(item => {
                item.api_data = {
                    ...item.api_data,
                    create_ymdhi: moment(item.api_data.create_ymdhi),
                    update_ymdhi: moment(item.api_data.update_ymdhi),
                };
            });
            return data;
        })
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_list'],
                }
            )
        );
}

export function do_upsert(params) {
    params = { ...params, MODE: 'UPSERT_API' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_upsert'],
                }
            )
        );
}

export function do_delete(params) {
    params = { ...params, MODE: 'DELETE_API' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_delete'],
                }
            )
        );
}

export function do_cache_flush(params = {}) {
    params = { ...params, MODE: 'ANNOTATION_CACHE_PURGE' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_cache_flush'],
                }
            )
        );
}

export function do_generate_access_token(host = '', params = {}) {
    params = { MODE: 'GENERATE', ...params };
    return axios
        .post(host + '/direct/rcms_api/token/', qs.stringify(params), { withCredentials: true })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_generate_access_token'],
                }
            )
        );
}

export function do_list_access_token(params = {}) {
    params = { MODE: 'LIST', ...params };
    return axios
        .get('/direct/rcms_api/token/', { params })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_list_access_token'],
                }
            )
        );
}

export function do_delete_access_token(params = {}) {
    params = { MODE: 'DELETE', ...params };
    return axios
        .get('/direct/rcms_api/token/', { params })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_delete_access_token'],
                }
            )
        );
}

export function do_import(formData) {
    formData.append('MODE', 'IMPORT_API');
    return axios
        .post(controller_uri, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_upsert'],
                }
            )
        );
}

export default {
    do_list,
    do_upsert,
    do_delete,
    do_cache_flush,
    do_generate_access_token,
    do_list_access_token,
    do_delete_access_token,
    do_import,
};
