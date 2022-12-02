import axios from 'axios';
import ApiSettings from '@/common/kuroco/ApiSettings';
import kurocoApi from '@/api/kuroco';
import { processError } from '@/api/utils';

class ApiAuth {
  static async loginByApiKey({
    apiId,
    params = {
      api_key: '',
      signature: '',
      sid: '',
    },
  }) {
    const apiSettings = new ApiSettings(apiId);
    const loginEndpoint = apiSettings.getEndpoint('login');
    if (!loginEndpoint) {
      throw new Error('Login endpoint could not be found for api_id=' + apiId);
    }
    return axios
      .post(apiSettings.getApiUrl() + loginEndpoint, params)
      .then(processError)
      .then(response => {
        return response;
      })
      .catch(err =>
        Promise.reject(
          err || {
            errors: ['Unexpected error'],
          }
        )
      );
  }
  static async getToken({
    apiId,
    params = {
      grant_token: '',
    },
  }) {
    const apiSettings = new ApiSettings(apiId);
    const tokenEndpoint = apiSettings.getEndpoint('token');
    if (!tokenEndpoint) {
      throw new Error('Token endpoint could not be found for api_id=' + apiId);
    }
    return axios
      .post(apiSettings.getApiUrl() + tokenEndpoint, params)
      .then(processError)
      .then(response => {
        return response;
      })
      .catch(err =>
        Promise.reject(
          err || {
            errors: ['Unexpected error'],
          }
        )
      );
  }
  static async getProfile({ apiId, accessToken = '', params = {} }) {
    const apiSettings = new ApiSettings(apiId);
    const profileEndpoint = apiSettings.getEndpoint('profile');
    if (!profileEndpoint) {
      throw new Error('Profile endpoint could not be found for api_id=' + apiId);
    }
    return kurocoApi
      .createApiClient({ apiId, accessToken })
      .get(apiSettings.getApiUrl() + profileEndpoint, params)
      .then(processError)
      .then(response => {
        return response;
      })
      .catch(err =>
        Promise.reject(
          err || {
            errors: ['Unexpected error'],
          }
        )
      );
  }
}

export default ApiAuth;
