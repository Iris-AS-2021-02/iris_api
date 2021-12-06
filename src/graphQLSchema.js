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

/*Lo mismo con los resolvers*/
//import messageResolvers from './Messages/resolvers';
import contactResolvers from './Contacts/resolvers';


// merge the typeDefs 
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		//messageTypeDef,
		contactTypeDef,
		//sus tydef
	],
	[
		//messageQueries,
		contactQueries,
		//sus queries
	],
	[
		//messageMutations,
		contactMutations,
		//sus mutaciones
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		//messageResolvers,
		contactResolvers,
		//pongan  los otros resolvers xd
	)
});