import { handleMissingEnvParam } from '../index.js';

export class EnvParamWrapper {

    key;
    defaultValue;
    
    constructor(key, defaultValue ) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    init() {
        let value = process.env[this.key];

        if (!isNaN(+value)) {   // !isNaN means 'is number', +value converts string to number
            return parseFloat(value);   // int will be parsed to int
        }

        value = value || this.defaultValue;

        if (typeof value === 'undefined') {
            handleMissingEnvParam(this.key);
        }

        return value;
    }
}