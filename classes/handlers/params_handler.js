//Module for loading environment variables from a .env file.
import dotenv from 'dotenv';
//Utility library for working with JavaScript objects and arrays
import _ from 'lodash';
import {handleMissingEnvParam} from '../../index.js'

//Responsible for handling and managing runtime parameters
export class ParamsHandler {

    params;
    baseParamsValues;

    constructor(params) {
        this.params = params;
        this.baseParamsValues = [];
        dotenv.config();
        this.initRunTimeParams();
    }

    //Responsible for initializing runtime parameters
    initRunTimeParams() {
        this.params.forEach(param => {
            this.baseParamsValues.push({ key: param.key, value: this.initParam(param) });
        });
    }

    //Checks if the parameter has a value
    initParam(param) {
        let value = process.env[param.key];

        if (!isNaN(+value)) {   // !isNaN means 'is number', +value converts string to number
            return parseFloat(value);   // int will be parsed to int
        }

        value = value || param.defaultValue;

        if (typeof value === 'undefined') {
            handleMissingEnvParam(param.key);
        }

        return value;
    }

    getParamValue(key) {
        const paramKeyValue = this.baseParamsValues.find(param => param.key === key);

        if (paramKeyValue === undefined) {
            throw `Unknown param key '${key}' was used.`;
        }

        return paramKeyValue.value;
    }
}





