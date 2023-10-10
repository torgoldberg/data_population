import _ from 'lodash';
import { EOL } from 'node:os';

import {
    sleep, getRandomIntInRange, writeToFile, 
    sendAPIRequest
} from '../../../index.js'

export class LatencyReportCreator {

    method = 'GET';
    loginUrl = '/auth/local/1/stage/1';
    expectedResponse = { redirect_uri: '/v1/redirect' };
    startRunTime = new Date();
    outputFile;

    constructor(paramsHandler) {
        this.paramsHandler = paramsHandler;
        this.outputFile = `output/LatencyReport-${this.paramsHandler.getRegion()}.csv`;
    }

    async defineParallelJob(apiInfo, user) {

        let requestTime, responseTime;
        let responseSuccess, reasonForFailure;
        let loginIndex = 0;
        let currentTime;

        const url = `${this.loginUrl}?username=${user}&password=${this.paramsHandler.getUserPassword()}`;

        // suspend each job for a different amount of time (random number of seconds between 0-15) in order to distribute sessions creation
        await sleep(getRandomIntInRange(0, 15) * 1000);

        currentTime = new Date()
        while ((currentTime - this.startRunTime) <= this.paramsHandler.getRunTimeMin() * 60 * 1000) {
            // multiple logins with the same user
            loginIndex++;
            try {
                console.log(`Creating session #${loginIndex} for ${user}`);
                responseSuccess = true;
                responseTime = undefined;
                reasonForFailure = '';

                requestTime = Date.now();

                // status code 200 is checked in sendAPIRequest()
                const response = await sendAPIRequest({ apiInfo, method: this.method, url });

                responseTime = (Date.now() - requestTime) / 1000; // ASAP, before additional checks which take additional time

                // response data is checked here
                const actualResponse = response.data;
                if (!_.isEqual(response.data, this.expectedResponse)) {
                    throw new Error(`Unexpected response data '${JSON.stringify(actualResponse)}' instead of '${JSON.stringify(this.expectedResponse)}'`);
                }
            } catch (err) { // will be reached upon unexpected status code or response data
                if (typeof responseTime === 'undefined') {  // upon enexpected status code
                    responseTime = (Date.now() - requestTime) / 1000;
                }
                responseSuccess = false;
                reasonForFailure = err.message; // `${method} ${url}: '${err.message}'`;
            } finally {

                const outputFields = [this.paramsHandler.getRegion(),
                    user,
                    loginIndex,
                responseSuccess.toString(),
                responseTime.toFixed(1),
                    reasonForFailure];

                writeToFile(this.outputFile, `${outputFields.join()}${EOL}`, true);    // split by commas and add EOL for proper .csv formatting; output in append mode

                // suspend each job for a different amount of time (random number of seconds between 12-15) in order to distribute sessions creation and prevent login lock upon performing more than 5 calls within 1 minute
                await sleep(getRandomIntInRange(12, 15) * 1000);
                currentTime = new Date()
            }
        }
    }

    outputColumnNames() {
        const columnNames = "Region,User,Session,Response success,Response time in sec,Error" + EOL;
        writeToFile(this.outputFile, columnNames);
    }

    printSummary() {
        console.log('-----------------------------');
        console.log(`Execution time: ${((new Date() - this.startRunTime) / 1000 / 60).toFixed(2)} minutes.`);
        console.log('');
    }
}