import { generalRequest, getRequest } from '../utilities';
import { url, port} from './server';

const URL = `http://${url}:${port}`;
console.log(URL);
const resolvers = {

	Query: {
		getAllCall: (_) =>
			getRequest(`${URL}/${'getAll'}`,''),
            
        
	},
	Mutation: {
		save: (_, {call}) =>
			generalRequest(`${URL}/${'saveCall'}`, 'POST', call),
		deleteCall:(_,{id}) =>
			generalRequest(`${URL}/delete/${id}`, 'DELETE', '')
	}
};

export default resolvers;