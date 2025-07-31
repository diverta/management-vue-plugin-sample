import config from '@/common/config';

class ApiSettings {
  constructor(apiId) {
    if (!config.API_SETTINGS[apiId]) {
      throw new Error('API settings could not be found for api_id=' + apiId);
    }
    this.apiId = apiId;
  }
  getApiUrl() {
    return `${config.API_URL}/rcms-api/${this.apiId}/`;
  }
  get() {
    return config.API_SETTINGS[this.apiId] || {};
  }
  isCookieAuth() {
    return this.get().apiSecurity === 'cookie';
  }
  getEndpoint(type) {
    if (typeof this.get().endpoint !== 'object') {
      throw new Error('Unexpected auth endpoint settings for api_id=' + this.apiId);
    }
    return (this.get().endpoint || {})[type] || '';
  }
}

export default ApiSettings;
