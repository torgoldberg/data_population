import {
    sendAPIRequest, fetchData, getValuesByKeys,
    printSummaryLine,
    userSchema, validateSchema
} from '../../index.js'


export const validateSchemaUsers = (async (apiInfo, user) => {

    await deleteUser(apiInfo, user.username);

    await createUser(apiInfo, user);

    const createdUser = await verifyUserExists(apiInfo, user.username, true);

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

    if (user.admin) {
        const currentAdminsIds = await getCurrentAdminsIds(apiInfo);
        const updatedAdminsIds = currentAdminsIds.concat(createdUser.id);
        await updateAdminsIds(apiInfo, updatedAdminsIds);
    }

    printSummaryLine(`User ${user.username} was re-created`, startRunTime);
})

export const deleteUser = (async (apiInfo, username) => {

    const method = 'DELETE';
    const url = `/users/${username}`;
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

const getCreateUserData = (async (apiInfo, user) => {

    // automation defaults
    let data = {
        name: user.username,
        password: user.password,
        send_email: (typeof user.sendEmail !== 'undefined') ? user.sendEmail : false
    };

    // application defaults
    if (user.email) {
        data.email = user.email;
    }
    if (user.phoneNumber) {
        data.phone_number = user.phoneNumber;
    }
    return data;
})

export const createUser = (async (apiInfo, user) => {

    const method = 'PUT';
    const url = `/users`;
    const data = await getCreateUserData(apiInfo, user);
    const expectedStatus = 201;

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
    const url = `/users/${username}`;

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
