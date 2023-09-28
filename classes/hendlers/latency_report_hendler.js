import { ParamsHendler } from '../../index.js';

export class LatencyReportHandler extends ParamsHendler {

    constructor() {
        
        const params = [
            { key: 'TENANT' },
            { key: 'API_ENTRY_POINT' },
            { key: 'API_BASE_URL_SUFFIX' },
            { key: 'API_VERSION' },
            { key: 'USER_BASENAME' },
            { key: 'USER_PASSWORD' },
            { key: 'NUM_USERS' },
            { key: 'START_INDEX', defaultValue: 1 },
            { key: 'RUN_TIME_MIN' },
            { key: 'REGION' },
        ];

        super(params);
    }

    getTenant() { return this.getParamValue('TENANT'); }
    getApiEntryPoint() { return this.getParamValue('API_ENTRY_POINT'); }
    getApiBaseUrlSuffix() { return this.getParamValue('API_BASE_URL_SUFFIX'); }
    getApiVersion() { return this.getParamValue('API_VERSION'); }
    getUserBasename() { return this.getParamValue('USER_BASENAME'); }
    getUserPassword() { return this.getParamValue('USER_PASSWORD'); }
    getNumUsers() { return this.getParamValue('NUM_USERS'); }
    getStartIndex() { return this.getParamValue('START_INDEX'); }
    getRunTimeMin() { return this.getParamValue('RUN_TIME_MIN'); }
    getRegion() { return this.getParamValue('REGION'); }
    getApiBaseUrl() { return `https://${this.getApiEntryPoint()}.${this.getTenant()}.${this.getApiBaseUrlSuffix()}/${this.getApiVersion()}`; }
    getApiInfo() {
        return {
            apiBaseUrl: this.getApiBaseUrl()
        };
    }
}