import { generalRequest, getRequest } from '../utilities';
import { url, port} from './server';

const URL = `http://${url}:${port}`;
console.log(URL);
const resolvers = {
	Query: {
		allusersettings: (_) =>
			getRequest(`${URL}/${'allusersettings'}`, ''),
            usersettingbyid: (_, { id}) =>
			generalRequest(`${URL}/${'usersettingbyid'}/${id}`, 'GET'),
        
	},
	Mutation: {
		usersetting: (_, { UserPreference }) =>
			generalRequest(`${URL}/${'usersetting'}`, 'POST', UserPreference),
	}
};

export default resolvers;