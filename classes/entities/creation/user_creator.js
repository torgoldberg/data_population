import {
    BaseCreator,
    createUserIteration,
    verifyMandatoryUserStatus,
    verifyMandatoryUserId
} from '../../../index.js';

export class UserCreator extends BaseCreator {

    coreData;
    paramsHandler;
    testData = './json_data/user.json';

    constructor(paramsHandler) {
        super('users');
        this.paramsHandler = paramsHandler;
    }

    createEntitiesFromTestData = (async (users) => {

        const apiInfo = this.paramsHandler.getApiInfo();
        
        for (const user of users) {
            user.id = verifyMandatoryUserId(user);
            user.username = verifyMandatoryUserStatus(user);
            user.status = verifyMandatoryUserStatus(user);
            try {
                await createUserIteration(
                    {
                        apiInfo,
                        user,
                        shouldVerify: this.paramsHandler.getVerifyCreationDeletion(),
                        deleteOnly: this.paramsHandler.getDeleteOnly()
                    });
            } catch (err) { console.log(err); }
        }
    })
}