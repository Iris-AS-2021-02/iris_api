import { generalRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		contactsByUserId: (_, { userId }) =>
			generalRequest(`${URL}/GetContacts?userId=${userId}`, 'GET'),
        contactById: (_, { contactId }) =>
			generalRequest(`${URL}/GetContact?contactId=${contactId}`, 'GET'),
	},
	Mutation: {
		synchronize: (_, { userId, phoneContacts }) =>
			generalRequest(`${URL}/Synchronize?userId=${userId}`, 'POST', phoneContacts),
        setSettings: (_, { contactSettings }) =>
			generalRequest(`${URL}/ChangeOptions`, 'POST', contactSettings)
    }
};

export default resolvers;
