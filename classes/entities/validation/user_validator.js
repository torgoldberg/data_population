import {
    ValidatorBase,
    validateSchemaUsers
} from '../../../index.js';

export class UserValidator extends ValidatorBase {

    paramsHandler;
    schemaValidationData = './config/schema-validation/validation-data/User.json';

    constructor(paramsHandler) {
        super('users');
        this.paramsHandler = paramsHandler;
    }

    process = (async() => {
        this.schemaValidationErrors = await validateSchemaUsers(this.paramsHandler.getApiInfo(), this.schemaValidationEntity);
    })
}