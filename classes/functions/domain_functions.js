import { fetchData, getValuesByKeys } from '../../index.js';

const url = "/domains";
const idFieldName = "id";

export const fetchDomains = (async (apiInfo) => {
    return await fetchData(apiInfo, url, idFieldName);
})

export const getDomainsIdsByNames = ((coreData, names) => {
    return getValuesByKeys(coreData.domains.nameId, names);
})