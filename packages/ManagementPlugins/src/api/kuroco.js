import ApiUser from '@/common/kuroco/ApiUser';
import ApiSettings from '@/common/kuroco/ApiSettings';
import axios from 'axios';
import config from '@/common/config';

const utils = {
  isValidPath(path) {
    return path.startsWith('/rcms-api/');
  },
  parseApiId(path) {
    if (!this.isValidPath(path)) {
      return null;
    }
    const pathParts = path.split('/');
    if (isNaN(pathParts[2])) {
      return null;
    }
    return parseInt(pathParts[2]);
  },
};

const apiUsers = {};

const kurocoApiClient = async ({ path, credentials }) => {
  if (!utils.isValidPath(path)) {
    throw new Error('Unexpected endpoint path: ' + path);
  }
  const apiId = utils.parseApiId(path);
  if (isNaN(apiId)) {
    throw new Error('Unexpected endpoint path - api_id must be specified: ' + path);
  }

  if (!apiUsers[apiId]) {
    apiUsers[apiId] = new ApiUser({ apiId, credentials });
  }
  const user = apiUsers[apiId];
  const authStatus = await user.authenticate();

  const apiClient = createApiClient({
    apiId,
    accessToken: authStatus.access_token,
  });

  return apiClient;
};

function createApiClient({ apiId, accessToken }) {
  const apiSettings = new ApiSettings(apiId);
  return axios.create({
    baseURL: config.API_URL,
    headers: apiSettings.isCookieAuth(apiId) ? {} : { 'X-RCMS-API-ACCESS-TOKEN': accessToken },
  });
}

async function get({ path, credentials, config = { params: {} } }) {
  const apiClient = await kurocoApiClient({ path, credentials });
  return apiClient.get(path, config);
}

async function post({ path, credentials, data = {}, config = { params: {} } }) {
  const apiClient = await kurocoApiClient({ path, credentials });
  return apiClient.post(path, data, config);
}

export default {
  createApiClient,
  get,
  post,
  utils,
};
