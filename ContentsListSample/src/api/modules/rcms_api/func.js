import axios from 'axios';
import { processError } from '../../utils';

const controller_uri = '/management/staticcontents/staticcontents_list/';

export function do_func_list(params = {}) {
    params = { ...params, MODE: 'LIST_CONTENTS' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_function_list'],
                }
            )
        );
}

export function do_func_category_list(params = {}) {
    params = { ...params, MODE: 'LIST_CATEGORIES' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling api.do_function_category_list'],
                }
            )
        );
}

export default {
    do_func_list,
    do_func_category_list,
};
