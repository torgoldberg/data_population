import { ParamsHandler } from '../../index.js';

export class EntitiesHandler extends ParamsHandler {

    constructor() {

        const params = [
            { key: 'TENANT' },
            { key: 'API_ENTRY_POINT' },
            { key: 'API_BASE_URL_SUFFIX' },
            { key: 'API_VERSION' },
            { key: 'API_KEY_USERNAME' },
            { key: 'API_KEY_PASSWORD' },
            { key: 'API_KEY' },
            { key: 'MASSIVE_LOAD', defaultValue: 0 },
            { key: 'START_INDEX', defaultValue: 1 },
            { key: 'VERIFY_CREATION_DELETION', defaultValue: 1 },
            { key: 'DELETE_ONLY', defaultValue: 0 },
        ];
        super(params);
    }

    getTenant() { return this.getParamValue('TENANT'); }
    getApiEntryPoint() { return this.getParamValue('API_ENTRY_POINT'); }
    getApiBaseUrlSuffix() { return this.getParamValue('API_BASE_URL_SUFFIX'); }
    getApiVersion() { return this.getParamValue('API_VERSION'); }
    getApiKeyUsername() { return this.getParamValue('API_KEY_USERNAME'); }
    getApiKeyPassword() { return this.getParamValue('API_KEY_PASSWORD'); }
    getApiKey() { return this.getParamValue('API_KEY'); }
    getMassiveLoad() { return this.getParamValue('MASSIVE_LOAD'); }
    getStartIndex() { return this.getParamValue('START_INDEX'); }
    getVerifyCreationDeletion() { return this.getParamValue('VERIFY_CREATION_DELETION'); }
    getDeleteOnly() { return this.getParamValue('DELETE_ONLY'); }
    getApiBaseUrl() { return `https://${this.getApiEntryPoint()}.${this.getTenant()}.${this.getApiBaseUrlSuffix()}`; }
    getDomainName() { return `${this.getTenant()}.${this.getApiBaseUrlSuffix()}`; }
    getApiInfo() {
        return {
            apiBaseUrl: this.getApiBaseUrl(),
            apiKeyUsername: this.getApiKeyUsername(),
            apiKeyPassword: this.getApiKeyPassword(),
            apiKey: this.getApiKey()
        }
    }
}