import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import koaBodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';

import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import graphQLSchema from './graphQLSchema';
import { formatErr } from './utilities';
import { login, register, verifyToken } from './account';
// import { dirname } from 'path/posix';

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
const graphql = graphqlKoa((ctx) => ({
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

router.post('/graphql', koaBodyParser(), graphql);
router.get('/graphql', graphql);
// test route
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line

const options = {
	key: fs.readFileSync(path.join('ssl', 'key.pem')),
	cert: fs.readFileSync(path.join('ssl', 'cert.pem'))
};

const sslServer = https.createServer(options, app.callback());
sslServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
