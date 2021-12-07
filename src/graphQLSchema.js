import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';
/*Definir en su carpeta los typedefs e importarlos*/
import {
	messageMutations,
	messageQueries,
	messageTypeDef
} from './Messages/typeDefs';

import {
	contactMutations,
	contactQueries,
	contactTypeDef
} from './Contacts/typeDefs';
//Auth resolvers
import {
	userAuthMutations,
	userAuthQueries,
	userAuthTypeDef
} from './Auth/typeDefs'


/*Lo mismo con los resolvers*/
import messageResolvers from './Messages/resolvers';
import userAuthResolvers from './Auth/resolvers';
import contactResolvers from './Contacts/resolvers';



// merge the typeDefs 
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		messageTypeDef,
		userAuthTypeDef,
		contactTypeDef
		//sus tydef
	],
	[
		messageQueries,
		userAuthQueries,
		contactQueries
		//sus queries
	],
	[
		messageMutations,
		userAuthMutations,
		contactMutations
		//sus tydef
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		messageResolvers,
		userAuthResolvers,
		contactResolvers
		//pongan  los otros resolvers xd
	)
});