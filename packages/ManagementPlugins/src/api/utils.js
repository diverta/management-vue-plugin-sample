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
    return Promise.reject({
      errors: Array.isArray(data.errors) ? data.errors : [data.errors],
    });
  }
  return res.data;
}
