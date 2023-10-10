import fs from 'fs';
import { EOL } from 'node:os';
import { getElapsedTime } from '../../../index.js';

export class BaseCreator {

    entityType;
    entities;
    startTime = new Date();

    constructor(entityType) {
        if (this.constructor === BaseCreator) {
            throw new Error("Class 'BaseCreator' cannot be instantiated");
        }

        this.entityType = entityType;
    }

    createEntitiesFromTestData() {
        throw new Error("Method 'createEntitiesFromTestData' must be implemented.");
    }

    pre() {
        this.entities = JSON.parse(fs.readFileSync(this.testData));
    }

    async process() {
        if (this.paramsHandler.getMassiveLoad() === 0) {
            await this.createEntitiesFromTestData(this.entities);
        } else {
            if (isNaN(this.paramsHandler.getMassiveLoad())) {
                throw ("The 'MASSIVE_LOAD' parameter must be a number.");
            }
            await this.createDuplicateEntities(this.entities[0]);
        }
    }

    post() {
        console.log(`${EOL}Execution time:`,
            (this.paramsHandler.getMassiveLoad() > 0) ? this.paramsHandler.getMassiveLoad() : this.entities.length,
            this.entityType +
            ' were processed during',
            getElapsedTime(this.startTime, new Date()));

    }
}