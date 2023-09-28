import {
    CreatorBase,
    createUserIteration,
    handleMissingEntityProperty,
    generateString
} from '../../../index.js';

export class UserCreator extends CreatorBase {

    coreData;
    paramsHandler;
    testData = './json_data/Users.json';

    constructor(paramsHandler) {
        super('users');
        this.paramsHandler = paramsHandler;
    }

    getMandatoryUserName = (user => {
        const propertyName = 'username';
        if (!user[propertyName]) {
            handleMissingEntityProperty(propertyName);
        }

        return user.username;
    })

    verifyMandatoryUserPassword = (user => {
        const propertyName = 'password';
        if (!user[propertyName]) {
            handleMissingEntityProperty(propertyName);
        }
    })

    createEntitiesFromTestData = (async (users) => {

        const apiInfo = this.paramsHandler.getApiInfo();
        
        for (const user of users) {
            user.username = this.getMandatoryUserName(user);
            this.verifyMandatoryUserPassword(user);
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

    createDuplicateEntities = (async (firstUser) => {

        const user = Object.assign({}, firstUser);     // clone to keep 'users' unchanged upon assigning into user.username
        
        const userBaseName = this.getMandatoryUserName(user);
        this.verifyMandatoryUserPassword(user);

        const startIndex = this.paramsHandler.getStartIndex();

        const apiInfo = this.paramsHandler.getApiInfo();
        
        for (let i = 0; i < this.paramsHandler.getMassiveLoad(); i++) {
            user.username = generateString(userBaseName, startIndex + i);
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