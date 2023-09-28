import dotenv from 'dotenv';
import _ from 'lodash';

import { EnvParamWrapper } from '../../index.js';

let baseParamsValues = [];

export class ParamsHandler {

    params;

    constructor(params) {
        dotenv.config();
        this.params = params;
        this.initRunTimeParams(this.params);
    }

    initRunTimeParams(params, paramsValues = baseParamsValues) {
        
        params.forEach(param => {
            paramsValues.push({ key: param.key, value: (new EnvParamWrapper(param.key, param.defaultValue)).init() });
        });
    }

    getParamValue(key, paramsValues = baseParamsValues) {

        const paramKeyValue = paramsValues.find(param => param.key === key);

        if (paramKeyValue === undefined) {
            throw `Unknown param key '${key}' was used.`;
        }

        return paramKeyValue.value;
    }
}