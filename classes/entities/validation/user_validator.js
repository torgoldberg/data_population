import {
    BaseValidator,
} from '../../../index.js';

//Validating user related data or entities based on a schema
export class UserValidator extends BaseValidator {

    paramsHandler;
    schemaValidationData = './json_data/user_schema.json';

    constructor(paramsHandler) {
        super('users');
        this.paramsHandler = paramsHandler;
    }
}