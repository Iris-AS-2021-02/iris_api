import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allUsers: (_) =>
			getRequest(URL, ''),
		usersByNumber: (_, { number}) =>
			generalRequest(`${URL}/${number}`, 'GET'),
        usersWithNumber: (_, {numbers}) =>
            generalRequest(`${URL/find}/${numbers}`, 'GET'),
	},
	Mutation: {
		createUser: (_, { UserAuth }) =>
			generalRequest(`${URL}/`, 'POST', UserAuth),
	}
};

export default resolvers;
