import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import { processError } from '../../utils';

const controller_uri = '/management/rcms_api/api_list/';

export function do_list(params) {
    params = { ...params, MODE: 'LIST_URI' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .then(data => {
            data.uri_list.forEach(uri => {
                uri.uri_data = {
                    ...uri.uri_data,
                    create_ymdhi: moment(uri.uri_data.create_ymdhi),
                    update_ymdhi: moment(uri.uri_data.update_ymdhi),
                };
            });
            return data;
        })
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api_uri.do_list'],
                }
            )
        );
}

export function do_upsert(params) {
    params = { ...params, MODE: 'UPSERT_URI' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api_uri.do_upsert'],
                }
            )
        );
}

export function do_delete(params) {
    params = { ...params, MODE: 'DELETE_URI' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api_uri.do_delete'],
                }
            )
        );
}

export function do_cdn_cache_purge(params = {}) {
    params = { ...params, MODE: 'CDN_CACHE_PURGE' };
    return axios
        .post(controller_uri, qs.stringify(params))
        .then(processError)
        .catch(err => {
            return Promise.reject(
                err || {
                    errors: ['Error calling api.do_cdn_cache_purge'],
                }
            );
        });
}

export function get_history_list(params) {
    params = { ...params, MODE: 'HISTORY_URI_LIST' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .then(data => {
            data.api_uri_history_list.forEach(uri => {
                uri.change_ymdhi = moment(uri.change_ymdhi).format('YYYY/MM/DD HH:mm:ss');
            });
            return data;
        })
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api_uri.get_history_list'],
                }
            )
        );
}

export function get_history(params) {
    params = { ...params, MODE: 'HISTORY_URI' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .then(data => {
            data.api_uri_history.uri_data = {
                ...data.api_uri_history.uri_data,
                create_ymdhi: moment(data.api_uri_history.uri_data.create_ymdhi),
                update_ymdhi: moment(data.api_uri_history.uri_data.update_ymdhi),
            };
            return data;
        })
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api_uri.get_history'],
                }
            )
        );
}

export default {
    do_list,
    do_upsert,
    do_delete,
    do_cdn_cache_purge,
    get_history_list,
    get_history,
};
