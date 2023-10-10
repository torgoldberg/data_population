import {
    sendAPIRequest, fetchData, getValuesByKeys, 
    printSummaryLine,
    userSchema, validateSchema, handleMissingEntityProperty,
} from '../../index.js'

//Full proccess to varify shcema before using
export const validateSchemaUsers = (async (apiInfo, user) => {

    //Delete the specific user from user_schema to verify he doens't exist
    await deleteUser(apiInfo, user.username);

    //Create the specific user from user_schema to make sure you can create user
    await createUser(apiInfo, user);

    //Get the specific user from user_schema to make sure he exist
    const createdUser = await verifyUserExists(apiInfo, user.username, true);

    //
    const schemaValidationPassed = validateSchema(createdUser, userSchema);

    await deleteUser(apiInfo, user.username);

    return schemaValidationPassed;
})

export const createUserIteration = (async ({apiInfo, user, shouldVerify, deleteOnly }) => {
   
    const startRunTime = new Date();

    await deleteUser(apiInfo, user.username);

    await verifyUserDoesNotExist(apiInfo, user.username, shouldVerify);

    if (deleteOnly) {
        printSummaryLine(`User ${user.username} was deleted`, startRunTime);
        return;
    }

    const createdUser = await createUser(apiInfo, user);

    await verifyUserExists(apiInfo, user.username, shouldVerify);

    printSummaryLine(`User ${user.username} was re-created`, startRunTime);
})

//Send delete to a specific entity
export const deleteUser = (async (apiInfo, username) => {

    const method = 'DELETE';
    const url = `/user/${username}`;
    // no status verification here because we don't really care if the user existed or not, we want to ensure he doesn't exist
    const expectedStatus = null;

    try {
        await sendAPIRequest({ apiInfo, method, url , expectedStatus });
    } catch (err) {
        throw `deleteUser: ${method} ${url} ended up with error '${err.message}'`;
    }
})

const verifyUserDoesNotExist = (async (apiInfo, username, shouldVerify) => {

    if (!shouldVerify) {
        return;
    }

    const method = 'GET';
    const url = `/users/${username}`;
    const expectedStatus = 404;

    try {
        await sendAPIRequest({ apiInfo, method, url, expectedStatus });
    } catch (err) {
        throw `verifyUserDoesNotExist: ${method} ${url} ended up with error '${err.message}'`;
    }
})

const getCreateUserData = (async (user) => {
    // automation defaults
    let data = {
        "id": user.id,
        "username": user.username,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": user.password,
        "phone": user.phone,
        "userStatus": (typeof user.userStatus !== 'undefined') ? user.userStatus : 0
    };
    return data;
})

export const createUser = (async (apiInfo, user) => {

    const method = 'POST';
    const url = `/user`;
    const data = await getCreateUserData(user);
    const expectedStatus = 200;

    try {
        const response = await sendAPIRequest({ apiInfo, method, url, data, expectedStatus });
        return response.data;
    } catch (err) {
        throw `createUser: ${method} ${url} ended up with error '${err.message}'`;
    }
})

const verifyUserExists = (async (apiInfo, username, shouldVerify) => {

    if (!shouldVerify) {
        return;
    }

    const method = 'GET';
    const url = `/user/${username}`;

    try {
        const response = await sendAPIRequest({ apiInfo, method, url });
        return response.data;
    } catch (err) {
        throw `verifyUserExists: ${method} ${url} ended up with error '${err.message}'`;
    }
})

export const fetchUsers = (async (apiInfo) => {

    const url = "/users";
    const idFieldName = "id";
    
    return await fetchData(apiInfo, url, idFieldName);
})

export const getUsersIdsByNames = (async (apiInfo, usersNames) => {
    try {
        const usersData = await fetchUsers(apiInfo);
        return getValuesByKeys(usersData.nameId, usersNames).map(id => id.toString());
    } catch (err) {
        throw 'getUsersIdsByNames failed:', err;
    }
})
export const verifyMandatoryUserId = (user => {
    const propertyName = 'password';
    if (!user[propertyName]) {
        handleMissingEntityProperty(propertyName);
    }
    return user.id;
})

export const verifyMandatoryUserName = (user => {
    const propertyName = 'username';
    if (!user[propertyName]) {
        handleMissingEntityProperty(propertyName);
    }
    return user.username;
})

export const verifyMandatoryUserStatus = (user => {
    const propertyName = 'userStatus';
    if ( typeof user[propertyName] === 'undefined') {
        handleMissingEntityProperty(propertyName);
    }
    return user.userStatus;
})





