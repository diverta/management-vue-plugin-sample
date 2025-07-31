import axios from 'axios';
import { processError } from '../../utils';

const controller_uri = '/management/rcms_api/logs/';

export function fetch(params) {
    params = { ...params, MODE: 'FETCH_LOGS' };
    return axios
        .get(controller_uri, { params })
        .then(processError)
        .catch(err =>
            Promise.reject(
                err || {
                    errors: ['Error calling logs.fetch'],
                }
            )
        );
}

export default {
    fetch,
};
