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

import {
	ldapMutations,
	ldapQueries,
	ldapTypeDef
} from './Ldap/typeDefs';
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

import {
	stateMutations,
	stateQueries,
	stateTypeDef
} from './States/typeDefs'


/*Lo mismo con los resolvers*/
import messageResolvers from './Messages/resolvers';
import userAuthResolvers from './Auth/resolvers';
import contactResolvers from './Contacts/resolvers';
import ldapResolvers from './Ldap/resolvers';
import userPreferenceResolvers from './Preferences/resolvers';
import callResolvers from './Calls/resolvers';
import stateResolvers from './States/resolvers';

import userInfoResolvers from './Userinfo/resolvers';

// merge the typeDefs 
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		messageTypeDef,
		userAuthTypeDef,
		contactTypeDef,
		ldapTypeDef,
		userPreferenceTypeDef,
		callTypeDef,
		stateTypeDef,
		userInfoTypeDef,
		//sus tydef
	],
	[
		messageQueries,
		userAuthQueries,
		contactQueries,
		ldapQueries,
		userPreferenceQueries,
		callQueries,
		stateQueries,
		userInfoQueries,
		//sus queries
	],
	[
		messageMutations,
		userAuthMutations,
		contactMutations,
		ldapMutations,
		userPreferenceMutations,
		callMutations,
		stateMutations,
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
		ldapResolvers,
		userPreferenceResolvers,
		callResolvers,
		stateResolvers,
		userInfoResolvers,
		//pongan  los otros resolvers xd
	)
});
