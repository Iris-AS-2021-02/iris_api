import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allUsers : (_) =>
			getRequest(URL, ''),
		usersByNumber: (_, { number }) =>
			generalRequest(`${URL}/${number}`, 'GET'),
        usersWithNumber: (_, {number}) =>
            generalRequest(`${URL}/find/${number}`, 'GET'),
	},
	Mutation: {
		createUser: (_, { userAuth }) =>
			generalRequest(`${URL}/`, 'POST', userAuth),
	}
};

export default resolvers;
