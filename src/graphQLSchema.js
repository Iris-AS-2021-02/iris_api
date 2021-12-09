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

import {
	userPreferenceMutations,
	userPreferenceQueries,
	userPreferenceTypeDef
} from './Preferences/typeDefs'

import {
	callMutations,
	callQueries,
	callTypeDef
} from './Calls/typeDefs'
import {
	userInfoQueries,
	userInfoMutations,
	userInfoTypeDef
} from './Userinfo/typeDefs'


/*Lo mismo con los resolvers*/
import messageResolvers from './Messages/resolvers';
import userAuthResolvers from './Auth/resolvers';
import contactResolvers from './Contacts/resolvers';
import userPreferenceResolvers from './Preferences/resolvers';
import callResolvers from './Calls/resolvers';
import userInfoResolvers from './Userinfo/resolvers';

// merge the typeDefs 
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		messageTypeDef,
		userAuthTypeDef,
		contactTypeDef,
		userPreferenceTypeDef,
		callTypeDef,
		userInfoTypeDef,
		//sus tydef
	],
	[
		messageQueries,
		userAuthQueries,
		contactQueries,
		userPreferenceQueries,
		callQueries,
		userInfoQueries,
		//sus queries
	],
	[
		messageMutations,
		userAuthMutations,
		contactMutations,
		userPreferenceMutations,
		callMutations,
		userInfoMutations,
		//sus mutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		messageResolvers,
		userAuthResolvers,
		contactResolvers,
		userPreferenceResolvers,
		callResolvers,
		userInfoResolvers,
		//pongan  los otros resolvers xd
	)
});
