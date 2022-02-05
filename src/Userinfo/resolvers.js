import { generalRequest, getRequest} from '../utilities';
import { url, port} from './server';


const URL = `http://${url}:${port}`;

console.log(URL);

const resolvers = {
	Query: {
		userByNumber: (_, {id}) =>
			generalRequest(`${URL}/user/${id}`, 'GET'),
	},
	Mutation: {
		createUserInfo: (_, { request}) =>
			generalRequest(`${URL}/users`, 'POST', request),
		updateUserName: (_, { request}) =>
			generalRequest(`${URL}/userName`, 'PATCH', request),
		updateUserAbout: (_, { request}) =>
			generalRequest(`${URL}/userAbout`, 'PATCH', request),
		updateUserCel: (_, { request}) =>
			generalRequest(`${URL}/userCel`, 'PATCH', request),
	}
};

export default resolvers;
