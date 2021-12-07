import { generalRequest, getRequest } from '../utilities';
import { url, port, sendMessage, receiveMessage, deleteMessage, updateSeen } from './server';

const URL = `http://${url}:${port}`;
const resolvers = {
	Query: {
		receiveMessage: (_, { id }) =>
			generalRequest(`${URL}/${receiveMessage}/${id}`, 'GET'),
	},
	Mutation: {
		sendMessage: (_, { message }) =>
			generalRequest(`${URL}/${sendMessage}`, 'POST', message),
		updateSeen: (_, { id }) =>
			generalRequest(`${URL}/${updateSeen}/${id}`, 'PUT'),
		deleteMessage: (_, { id }) =>
			generalRequest(`${URL}/${deleteMessage}/${id}`, 'DELETE')
	}
};

export default resolvers;