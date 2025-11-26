import ApiSettings from '@/common/kuroco/ApiSettings';
import ApiAuth from '@/common/kuroco/ApiAuth';

class ApiUser {
  constructor({ apiId, credentials = { api_key: '', signature: '', sid: '' } }) {
    this.apiId = apiId;
    this.credentials = credentials;
    this.apiAuthStorage = new ApiAuthStorage(apiId);
    this.apiSettings = new ApiSettings(apiId);
  }
  async authenticate() {
    if (!this.shouldAuthenticate()) {
      // Already loggged in
      return this.apiAuthStorage.getStatus();
    }

    const loginResult = await ApiAuth.loginByApiKey({
      apiId: this.apiId,
      params: this.credentials,
    }).then(loginResult);

    // Fetch access token if target API supports token auth
    const tokenResult = this.apiSettings.isCookieAuth()
      ? {}
      : await ApiAuth.getToken({
          apiId: this.apiId,
          params: {
            grant_token: loginResult.grant_token,
          },
        }).then(tokenResult);

    const authStatus = {
      api_key: this.credentials.api_key,
      sid: this.credentials.sid,
      access_token: tokenResult.access_token.value,
      expiresAt: loginResult.info.expiresAt || tokenResult.access_token.expiresAt || null,
    };

    this.apiAuthStorage.set({
      memberId: loginResult.member_id,
      data: { status: authStatus },
    });
    return authStatus;
  }

  async getProfile() {
    await this.authenticate();
    const storedProfile = this.apiAuthStorage.getProfile();
    if (Object.keys(storedProfile).length > 0) {
      return storedProfile;
    }
    const authStatus = this.apiAuthStorage.getStatus();
    const profileResult = await ApiAuth.getProfile({
      apiId: this.apiId,
      accessToken: authStatus.access_token,
    }).then(profileResult);

    this.apiAuthStorage.set({
      memberId: profileResult.member_id,
      data: {
        status: authStatus,
        profile: profileResult,
      },
    });
    return profileResult;
  }

  shouldAuthenticate() {
    const authStatus = this.apiAuthStorage.getStatus();

    if (
      Object.keys(authStatus).length == 0 || // Status is not set
      authStatus.api_key != this.credentials.api_key || // Logged in as different member from previous login
      isNaN(authStatus.expiresAt) // Unexpected data
    ) {
      return true;
    }

    // Login session of api domain has been expired
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    const sessionIsExpired = authStatus.expiresAt < currentTimestamp;
    return sessionIsExpired;
  }
}

/**
 * API authentication status manager
 */
class ApiAuthStorage {
  constructor(apiId) {
    this.apiId = apiId;
  }
  storage() {
    return window.localStorage;
  }
  storageKey() {
    return 'kuroco.management.apiAuth';
  }
  getAll() {
    return JSON.parse(this.storage().getItem(this.storageKey())) || {};
  }
  get() {
    return (this.getAll().list || {})[this.apiId] || {};
  }
  getStatus() {
    return this.get().status || {};
  }
  getProfile() {
    return this.get().profile || {};
  }
  set({ memberId, data }) {
    const newStatus = {
      member_id: memberId,
      list: {
        // Reset all status if member_id have been changed
        ...(this.getAll().member_id === memberId ? this.getAll().list || {} : {}),
        ...{
          [this.apiId]: data,
        },
      },
    };
    this.storage().setItem(this.storageKey(), JSON.stringify(newStatus));
  }
}

export default ApiUser;
