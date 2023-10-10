import axios from 'axios';
import { EOL } from 'node:os';
import { Validator } from 'jsonschema';

import {
    fetchDomains
} from '../../index.js';


const HttpClientSingleton = (() => {
    let instance;

    //Sending the APi request with authorization
    const createInstance = ((apiInfo) => {
        return axios.create({
            baseURL: apiInfo.apiBaseUrl,
            headers: {
                'api_key': apiInfo.apiKey
            },
            auth: {
                username: apiInfo.apiKeyUsername,
                password: apiInfo.apiKeyPassword
            }
        });
    })

    return {
        getInstance: (apiInfo) => {
            if (!instance) {
                instance = createInstance(apiInfo);
            }
            return instance;
        }
    };
})();

export const sendAPIRequest = (async ({ apiInfo, method, url, data, expectedStatus = 200 }) => {

    const validateStatus = (actualStatus) => {
        if (expectedStatus) {
            return actualStatus === expectedStatus;
        }
        return true;
    };

    try {
        console.log(`Sending ${method} request to: ${apiInfo.apiBaseUrl}${url}`);
               // Log the headers being sent
            console.log("Headers:");
            console.log({
                ...apiInfo.headers, // Include headers from apiInfo if any
                "api_key": apiInfo.apiKey
            });
               
            console.log("Data:");
            console.log(data);
        return await (HttpClientSingleton.getInstance(apiInfo))({
            method,
            url,
            data,
            validateStatus
        });
    } catch (err) {
        if (err.message === 'Client network socket disconnected before secure TLS connection was established') {
            err.message += (`.${EOL}Unable to connect to ${apiInfo.apiBaseUrl}, please check configuration in .env`);
        }
        throw err;
    }
})

export const fetchData = (async (apiInfo, url, idFieldName) => {

    const method = 'GET';

    try {
        const response = await sendAPIRequest({ apiInfo, method, url });

        let nameId = new Map();
        let nameData = new Map();
        let idData = new Map();
        response.data.forEach(entity => {
            nameId.set(entity.name.toLowerCase(), parseInt(entity[idFieldName]));
            nameData.set(entity.name.toLowerCase(), entity);
            idData.set(parseInt(entity[idFieldName]), entity);
        });

        return { nameId, nameData, idData, data: response.data };
    } catch (err) {
        throw `fetchData for ${url} failed`, err;
    }
})

export const fetchCoreData = (async (apiInfo) => {

    let coreData = {};

    try {
        coreData.domains = await fetchDomains(apiInfo);
    } catch (err) {
        throw 'fetchDomains failed:', err;
    }
    return coreData;
})

export const getValuesByKeys = ((mapping = new Map(), keys = []) => {

    if (typeof keys === 'string') {
        keys = [keys];
    }

    let ids = [];
    keys.forEach(key => {
        key = key.toLowerCase();
        if (!mapping.has(key)) {
            throw `Unknown key '${key}' specified, should be one of the following (case insensitive): ${[...mapping.keys()]}`;
        }
        ids.push(mapping.get(key));
    });

    return ids;
})

export const validateSchema = (async (createdEntity, expectedSchema) => {

    const schemaValidationResult = new Validator().validate(createdEntity, expectedSchema, { required: true });   // required for handling undefined createdEntity
    return schemaValidationResult.errors;
})

export const reportSchemaValidationErrors = (async (errors) => {
    if (errors.length) {
        console.log();
        console.log(errors);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.warn('Warning: schema validation failed, please review errors above.')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log();
 };
})