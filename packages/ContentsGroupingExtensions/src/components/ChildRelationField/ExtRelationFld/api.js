import axios from 'axios';

export const API_RESPONSE_SUCCESS = '1';

export function processError(res) {
    if (!res.data && !(res.response && res.response.data)) {
        return Promise.reject();
    }
    const data = res.data || res.response.data;

    if (!(data instanceof Object)) {
        return Promise.reject();
    }

    if (data.validation_errors && data.validation_errors.length > 0) {
        return Promise.reject({ validationErrors: data.validation_errors });
    }
    if (data.errors && data.errors.length > 0) {
        return Promise.reject({ errors: Array.isArray(data.errors) ? data.errors : [data.errors] });
    }
    return res.data;
}

export function getRelatedFldList({ table_id, allowed_id, keyword, setting_id, ext_no, filters = [] }) {
    const params = {
        tableID: table_id,
        lang: 'ja',
        allowedId: allowed_id,
        callFromModule: 'topics',
        settingId: setting_id,
        extNo: ext_no,
        limit: 100,
        offset: 0,
        keyword,
    };

    for (const name in filters) {
        if (typeof filters[name] !== 'undefined' && filters[name] !== null) {
            params[name] = filters[name].value;
        }
    }

    return axios
        .get('/direct/topics/relation/', { params })
        .then(processError)
        .catch((err) =>
            Promise.reject(
                err || {
                    errors: ['要求中のエラー'],
                }
            )
        );
}

export function getRelatedFldLabel({ table_id, selected_item, allowed_id }) {
    const params = {
        tableID: table_id,
        id: selected_item,
        lang: 'ja',
        allowedID: allowed_id,
    };

    return axios
        .get('/direct/topics/relation_item/', { params })
        .then(processError)
        .catch((err) =>
            Promise.reject(
                err || {
                    errors: ['要求中のエラー'],
                }
            )
        );
}
