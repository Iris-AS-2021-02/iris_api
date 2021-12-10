import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint, states, users} from './server';

const URL = `http://${url}:${port}/${entryPoint}`;
console.log(URL);
const resolvers = {
	Query: {
		getAllStates: (_) =>
			getRequest(`${URL}/states`, ''),
		getUserStates: (_, { id }) =>
			generalRequest(`${URL}/${states}/${id}`, 'GET'),
        getAllStateUsers: (_, { id }) =>
            generalRequest(`${URL}/${users}/${id}`, 'GET'),
	},
	Mutation: {
		createState: (_, { stateInfo }) =>
			generalRequest(`${URL}/${states}`, 'POST', stateInfo),
		createUserState: (_, { userInfo }) =>
			generalRequest(`${URL}/${users}`, 'POST', userInfo),
		updateState: (_, { id } , { stateInfo }) =>
			generalRequest(`${URL}/${states}/${id}`, 'PUT', stateInfo),
		deleteState: (_, { id } ) =>
			generalRequest(`${URL}/${states}/${id}`, 'DELETE'),
		deleteUser: (_, { id } ) =>
			generalRequest(`${URL}/${users}/${id}`, 'DELETE'),
	}
};

export default resolvers;
