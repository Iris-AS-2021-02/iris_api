'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBodyParser = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');
require('path/posix');

/**
 * Creates a request following the given parameters
 * @param {string} urla
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try { return await request(parameters); } 
	catch (err) { return err; }
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const messageTypeDef = `
  type Message {
      id: String!
      sender: String!
      receiver: String!
      content: String!
      time_sent: String
      time_received: String
      time_seen: String
  }
  input MessageInput {
    receiver: String!
    content: String!
  }
  input ConversationInput {
    receiver: String!
    sender: String!
  }
  `;

const messageQueries = `
    receiveMessage(input: ConversationInput): [Message]
  `;

const messageMutations = `
    sendMessage(message: MessageInput!): Message!
    deleteMessage(id: String!): String
    updateSeen(id:String!): String
`;

const contactTypeDef = `
    type Contact {
        contactID: String!
        userID: String!
        contactPhone: String!
        contactName: String!
        blocked: Boolean!
        seeStatus: Boolean!
        wallpaper: String
    }
    type ContactSettings{
        contactID: String!
        blocked: Boolean!
        seeStatus: Boolean!
        wallpaper: String!
    }
    input ContactEntry{
        contactPhone: String!
        contactName: String!
    }
    input ContactSettingsInput{
        contactID: String!
        blocked: Boolean
        seeStatus: Boolean
        uRIWallpaper: String
        extension: String
        removeCurrentWallpaper: Boolean
    }`;

const contactQueries = `
        contactsByUserId(userId: String!): [Contact]!
        contactById(contactId: String!): Contact!
    `;

const contactMutations = `
        synchronize(userId: String!, phoneContacts: [ContactEntry]!): [Contact]!
        setSettings(contactSettings: ContactSettingsInput!): ContactSettings!
    `;

const ldapTypeDef = `
    type LdapUser {
        dn: String!,
        controls: [String]!,
        givenName: String!,
        sn: String!,
        uid: String!,
        userPassword: String!,
        uidNumber: String!,
        gidNumber: String!,
        homeDirectory: String!,
        objectClass: [String]!,
        cn: String!
    }
    type ValidationMessage{
        success: Boolean!
        message: String!
    }
    input Account {
        userName: String!
        password: String!
    }
    input UserAccount {
        userName: String!
    }`;

const ldapQueries = `
        verifyConnection: String
    `;

const ldapMutations = `
        createLdapUser(account: Account!): LdapUser!
        getLdapUser(userAccount: UserAccount!): LdapUser!
        modifyLdapUser(account: Account!): LdapUser!
        deleteLdapUser(userAccount: UserAccount!): String!
        verifyAccount(account: Account!): ValidationMessage!
    `;

const userAuthTypeDef = `
  type UserAuth{
      ID: String
      Name: String
      Number: String
  }
  input UserAuthInput {
    Name: String
    Number: String
  }`;

const userAuthQueries = `
    allUsers: [UserAuth]
    usersByNumber(number : String!): UserAuth
    usersWithNumber(number : String!) : [UserAuth]
  `;

const userAuthMutations = `
    createUser(userAuth : UserAuthInput!) : UserAuth
`;

const userPreferenceTypeDef = `
  type UserPreference{
    userId:String,
    blueTickMessageConfirmation:Boolean,
       seenStateConfirmation: Boolean,
       showLastOnline: Boolean,
       setDualAuth: Boolean
  }
  input UserPreferenceInput {
    userId:String,
    blueTickMessageConfirmation:Boolean,
       seenStateConfirmation: Boolean,
       showLastOnline: Boolean,
       setDualAuth: Boolean
  }`;

const userPreferenceQueries = `
allusersettings: [UserPreference]
usersettingbyid(id : String!): UserPreference
  `;

const userPreferenceMutations = `
usersetting(UserPreference : UserPreferenceInput!) : UserPreference
`;

const callTypeDef = `
  type call {
    call_id: Int!
    userId: String!
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }

  input CallInput {
    userId: String!
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }`;

const callQueries = `
  getAllCall: [call]!
  getcallsUser(userId: String!): [call]!

`;

const callMutations = `
  save(call: CallInput!): String!
  deleteCall(id: Int!) : String!
 
`;

const userInfoTypeDef = `
  type Response{
      id: Int
      name: String
      about: String
      cel: String
  }

  type UserResponse{
      _id: ID 
      id: Int
      name: String
      about: String
      cel: String
  }

  input UserIn{
      id: Int
      name: String
      about: String
      cel: String
  }

 `;

const userInfoQueries = `
    userByNumber(id: Int!): UserResponse
  `;

const userInfoMutations = `
    createUserInfo(request: UserIn!) : Response
    updateUserName(request: UserIn!) : Response
    updateUserAbout(request: UserIn!) : Response
    updateUserCel(request: UserIn!) : Response
`;

const stateTypeDef = `
  type State{

      id: String!
      serialNumber: String!
      type: String
      publicationDate: String!
      style: String!
      commentary: String
      imageFile: String
      user_id: String!
      created_at: String
      
  }

  type User{

      id: String!
      userIdNumber: String!
      name: String!
      created_at: String!
    
  }

  type resValidation{

    res: String!
    message: String!
  
  }

  input StateInput {
      serialNumber: String!
      type: String!
      publicationDate: String!
      style: String
      commentary: String
      imageFile: String
      user_id: String
  }

  input UserInput {
      userIdNumber: String!
      name: String!
}`;

const stateQueries = `
      getAllStates: [State]
      getUserStates(id: String!): State
      getAllStateUsers(id: String!): User
  `;

const stateMutations = `
      createState(stateInfo: StateInput!) : resValidation
      createUserState(userInfo: UserInput!) : resValidation
      updateState(stateInfo: StateInput!) : resValidation
      deleteState(id: String!) : resValidation
      deleteUser(id: String!) : resValidation
  `;

/*aca iran los datos de su ms*/
const url = 'host.docker.internal';
const port = '8085';
const sendMessage = 'sendmessage';
const receiveMessage = 'getmessage';
const deleteMessage = 'message';
const updateSeen = 'updateseen';

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

const url$1 = 'host.docker.internal';
const port$1 = '1024';
const entryPoint = 'user';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint}`;

const resolvers$1 = {
	Query: {
		allUsers : (_) =>
			getRequest(URL$1, ''),
		usersByNumber: (_, { number }) =>
			generalRequest(`${URL$1}/${number}`, 'GET'),
        usersWithNumber: (_, {number}) =>
            generalRequest(`${URL$1}/find/${number}`, 'GET'),
	},
	Mutation: {
		createUser: (_, { userAuth }) =>
			generalRequest(`${URL$1}`, 'POST', userAuth),
	}
};

const url$2 = 'host.docker.internal';
const port$2 = '8088';
const entryPoint$1 = 'contacts';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$1}`;

const resolvers$2 = {
	Query: {
		contactsByUserId: (_, { userId }) =>
			generalRequest(`${URL$2}/GetContacts?userId=${userId}`, 'GET'),
        contactById: (_, { contactId }) =>
			generalRequest(`${URL$2}/GetContact?contactId=${contactId}`, 'GET'),
	},
	Mutation: {
		synchronize: (_, { userId, phoneContacts }) =>
			generalRequest(`${URL$2}/Synchronize?userId=${userId}`, 'POST', phoneContacts),
        setSettings: (_, { contactSettings }) =>
			generalRequest(`${URL$2}/ChangeOptions`, 'POST', contactSettings)
    }
};

const ldapUrl = 'host.docker.internal';
const ldapPort = '9000';
const ldapEntryPoint = 'ldap';

const URL$3 = `http://${ldapUrl}:${ldapPort}/${ldapEntryPoint}`;

const resolvers$3 = {
	Query: {
		verifyConnection : (_) =>
			getRequest(URL$3, '')
	},
	Mutation: {
		createLdapUser: (_, { account }) =>
			generalRequest(`${URL$3}/createUser`, 'POST', account),
		getLdapUser: (_, { userAccount }) =>
			generalRequest(`${URL$3}/findUser`, 'POST', userAccount),
		modifyLdapUser: (_, { account }) =>
			generalRequest(`${URL$3}/modifyUser`, 'PUT', account),
        deleteLdapUser: (_, { userAccount }) =>
			generalRequest(`${URL$3}/deleteUser`, 'DELETE', userAccount),
		verifyAccount: (_, { account }) =>
			generalRequest(`${URL$3}/verifyAccount`, 'POST', account)
    }
};

const url$3 = '172.17.0.1';
const port$3 = '8087';

const URL$4 = `http://${url$3}:${port$3}`;
console.log(URL$4);
const resolvers$4 = {
	Query: {
		allusersettings: (_) =>
			getRequest(`${URL$4}/${'allusersettings'}`, ''),
            usersettingbyid: (_, { id}) =>
			generalRequest(`${URL$4}/${'usersettingbyid'}/${id}`, 'GET'),
        
	},
	Mutation: {
		usersetting: (_, { UserPreference }) =>
			generalRequest(`${URL$4}/${'usersetting'}`, 'POST', UserPreference),
	}
};

const url$4 = 'host.docker.internal';
const port$4 = '9091';

const URL$5 = `http://${url$4}:${port$4}`;
console.log(URL$5);
const resolvers$5 = {

	Query: {
		getAllCall: (_) =>
			getRequest(`${URL$5}/${'getAll'}`,''),
		getcallsUser: (_, {userId}) =>
			generalRequest(`${URL$5}/getcallsUser/${userId}`, 'GET'),
        
	},
	Mutation: {
		save: (_, {call}) =>
			generalRequest(`${URL$5}/${'saveCall'}`, 'POST', call),
		deleteCall:(_,{id}) =>
			generalRequest(`${URL$5}/delete/${id}`, 'DELETE', '')
	}
};

const url$5 = 'host.docker.internal';
const port$5 = '8000';
const entryPoint$2 = 'api';
const states = 'states';
const users = 'users';

const URL$6 = `http://${url$5}:${port$5}/${entryPoint$2}`;
console.log(URL$6);
const resolvers$6 = {
	Query: {
		getAllStates: (_) =>
			getRequest(`${URL$6}/states`, ''),
		getUserStates: (_, { id }) =>
			generalRequest(`${URL$6}/${states}/${id}`, 'GET'),
        getAllStateUsers: (_, { id }) =>
            generalRequest(`${URL$6}/${users}/${id}`, 'GET'),
	},
	Mutation: {
		createState: (_, { stateInfo }) =>
			generalRequest(`${URL$6}/${states}`, 'POST', stateInfo),
		createUserState: (_, { userInfo }) =>
			generalRequest(`${URL$6}/${users}`, 'POST', userInfo),
		updateState: (_, { id } , { stateInfo }) =>
			generalRequest(`${URL$6}/${states}/${id}`, 'PUT', stateInfo),
		deleteState: (_, { id } ) =>
			generalRequest(`${URL$6}/${states}/${id}`, 'DELETE'),
		deleteUser: (_, { id } ) =>
			generalRequest(`${URL$6}/${users}/${id}`, 'DELETE'),
	}
};

const url$6 = '0.0.0.0';
const port$6 = '8080';

const URL$7 = `http://${url$6}:${port$6}`;

console.log(URL$7);

const resolvers$7 = {
	Query: {
		userByNumber: (_, {id}) =>
			generalRequest(`${URL$7}/user/${id}`, 'GET'),
	},
	Mutation: {
		createUserInfo: (_, { request: request$$1}) =>
			generalRequest(`${URL$7}/users`, 'POST', request$$1),
		updateUserName: (_, { request: request$$1}) =>
			generalRequest(`${URL$7}/userName`, 'PATCH', request$$1),
		updateUserAbout: (_, { request: request$$1}) =>
			generalRequest(`${URL$7}/userAbout`, 'PATCH', request$$1),
		updateUserCel: (_, { request: request$$1}) =>
			generalRequest(`${URL$7}/userCel`, 'PATCH', request$$1),
	}
};

/*Definir en su carpeta los typedefs e importarlos*/
//Auth resolvers
/*Lo mismo con los resolvers*/
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
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers,
		resolvers$1,
		resolvers$2,
		resolvers$3,
		resolvers$4,
		resolvers$5,
		resolvers$6,
		resolvers$7,
		//pongan  los otros resolvers xd
	)
});

const jwt = require("jsonwebtoken");
const axios = require("axios");

const secretOrPrivateKey = 'secretKey';
const UserURL = `http://${url$1}:${port$1}/${entryPoint}`;
const LdapURL = `http://${ldapUrl}:${ldapPort}/${ldapEntryPoint}`;

async function login(ctx){
    const payload = { phone: ctx.request.body.phone, name: ctx.request.body.name};
    const options = { expiresIn: 1440 };
    
    
    
    try{
        let response = await axios.get(`${UserURL}/find/${payload.phone}`);
        let data = response.data[0];

        console.log(data);
        
        ctx.response.status = 401;
        ctx.response.body = { success: false, token: null };
        
        if(data.Name === payload.name){
            
            let isValidAccount = await axios.post(`${LdapURL}/verifyAccount`, {
                userName: payload.phone,
                password: payload.name
            });
            
            if(isValidAccount){
                const token = jwt.sign(payload, secretOrPrivateKey, options);
                ctx.response.status = 200;
                ctx.response.body = { success: true, data: { token: token, user: data } };
            }
        }
    }
    catch(e){
        ctx.response.status = 401;
        ctx.response.body = { success: false, data: null };
        console.log(e);
    }
}

async function register(ctx){
    const account = { userName: ctx.request.body.phone, password: ctx.request.body.name };
    const user = { Name: ctx.request.body.name, Number: ctx.request.body.phone };
    

    try{
        const ldapResponse = await axios.post(`${LdapURL}/createUser`, account);
        if(ldapResponse.status === 200 && ldapResponse.data !== null){
            
            const userResponse = await axios.post(UserURL, user);
            if(userResponse.status === 200 && userResponse.data !== null){
                ctx.response.status = 200;
                ctx.response.body = { success: true, user: userResponse.data, message: "User created successfully" };
            }
            else{
                throw new Error("User not created in Iris auth ms")
            }
        }
        else 
            throw new Error("User not created in active directory")
    }
    catch(e){
        ctx.response.status = 400;
        ctx.response.body = { success: false, user: null, message: e.message };
    }
}

async function verifyToken(ctx){
    
    let tokenIsValid = true;
    
	if(ctx.header.authorization){
        const authorization = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
        const token = authorization["input"].split(' ')[1];
    
        jwt.verify(token, secretOrPrivateKey, (error, decoded) => {
            if(error != null){
                ctx.response.status = 401;
				ctx.response.body = { message: 'Invalid token' };
                tokenIsValid = false;
            }
        });
    }
    else{
        ctx.response.status = 401;
        ctx.response.body = { message: 'Token not provided' };
        tokenIsValid = false;
    }
    
    return tokenIsValid;
}

const https = require('https');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;
const koaBody = require('koa-body');

app.use(koaLogger());
app.use(koaCors());

// authorization
app.use(async (ctx, next) => {
	if(['/account/login', '/account/register'].includes(ctx.url)){
		await next();
	}
	else{
		let isAuthorized = await verifyToken(ctx);
		if(isAuthorized)
			await next();
	}
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));

router.post("/account/login", koaBody(), async (ctx) => {
    await login(ctx);
});

router.post("/account/register", koaBody(), async (ctx) => {
    await register(ctx);
});

router.post('/graphql', koaBodyParser(), graphql$1);
router.get('/graphql', graphql$1);
// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line

const options = {
	key: fs.readFileSync(path.join('ssl', 'key.pem')),
	cert: fs.readFileSync(path.join('ssl', 'cert.pem'))
};

const sslServer = https.createServer(options, app.callback());
sslServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
