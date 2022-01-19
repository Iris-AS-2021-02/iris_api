import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import koaBodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';

import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import graphQLSchema from './graphQLSchema';
import { formatErr } from './utilities';
import { login, verifyAuthorization } from './authorization';

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;
const koaBody = require('koa-body');

app.use(koaLogger());
app.use(koaCors());

// authorization
app.use(async (ctx, next) => {
	if(ctx.url === '/authorization/jwt'){
		await next();
	}
	else{
		let isAuthorized = await verifyAuthorization(ctx);
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

router.post("/authorization/jwt", koaBody(), async (ctx) => {
    await login(ctx);
});

router.post('/graphql', koaBodyParser(), graphql);
router.get('/graphql', graphql);
// test route
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
