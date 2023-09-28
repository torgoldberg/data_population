import fs from 'fs';
import { reportSchemaValidationErrors } from '../../../index.js';

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

    pre() {
        console.log(`Validating ${this.entityType} schema...`)
        this.schemaValidationEntity = JSON.parse(fs.readFileSync(this.schemaValidationData));
    }

    post() {
        reportSchemaValidationErrors(this.schemaValidationErrors);
    }
}