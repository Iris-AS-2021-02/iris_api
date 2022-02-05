import { getRequest, generalRequest } from '../utilities';
import { ldapUrl, ldapPort, ldapEntryPoint } from './server';

const URL = `http://${ldapUrl}:${ldapPort}/${ldapEntryPoint}`;

const resolvers = {
	Query: {
		verifyConnection : (_) =>
			getRequest(URL, '')
	},
	Mutation: {
		createLdapUser: (_, { account }) =>
			generalRequest(`${URL}/createUser`, 'POST', account),
		getLdapUser: (_, { userAccount }) =>
			generalRequest(`${URL}/findUser`, 'POST', userAccount),
		modifyLdapUser: (_, { account }) =>
			generalRequest(`${URL}/modifyUser`, 'PUT', account),
        deleteLdapUser: (_, { userAccount }) =>
			generalRequest(`${URL}/deleteUser`, 'DELETE', userAccount),
		verifyAccount: (_, { account }) =>
			generalRequest(`${URL}/verifyAccount`, 'POST', account)
    }
};

export default resolvers;
