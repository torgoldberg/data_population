import fs from 'fs';
import { reportSchemaValidationErrors } from '../../../index.js';
import {
    validateSchemaUsers,
} from '../../../index.js';

export class BaseValidator {

    entityType;
    schemaValidationEntity;
    schemaValidationErrors;

    constructor(entityType) {
        if (this.constructor === BaseValidator) {
            throw new Error("Class 'BaseValidator' cannot be instantiated");
        }

        this.entityType = entityType;
    }

    //Validates the schema of an entity before any processing is done
    pre() {
        console.log(`Validating ${this.entityType} schema...`)
        this.schemaValidationEntity = JSON.parse(fs.readFileSync(this.schemaValidationData));
    }

    //Reports schema validation errors
    post() {
        reportSchemaValidationErrors(this.schemaValidationErrors);
    }

    //Process the entity data and Validate it's schema
    async process() {
        const validationFunctions = {
            users: validateSchemaUsers
        };

        const validationFunction = validationFunctions[this.entityType];

        if (!validationFunction) {
            throw new Error(`Unsupported entityType: ${this.entityType}`);
        }

        this.schemaValidationErrors = await validateSchemaUsers(this.paramsHandler.getApiInfo(), this.schemaValidationEntity);
    }
}