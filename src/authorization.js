import { url, port, entryPoint } from './Auth/server';
const jwt = require("jsonwebtoken");
const axios = require("axios")

const secretOrPrivateKey = 'secretKey';

export async function login(ctx){
    const payload = { phone: ctx.request.body.phone, name: ctx.request.body.name};
    const options = { expiresIn: 1440 };
    
    const URL = `http://${url}:${port}/${entryPoint}`;
    
    try{
        let response = await axios.get(`${URL}/find/${payload.phone}`);
        let data = response.data[0];
        const token = jwt.sign(payload, secretOrPrivateKey, options);
        
        ctx.response.status = 401;
        ctx.response.body = { success: false, token: null };
        
        if(data.Name === payload.name){
            ctx.response.status = 200;
            ctx.response.body = { success: true, token: token };
        }
    }
    catch(e){
        ctx.response.status = 401;
        ctx.response.body = { success: false, token: null };
        console.log(e);
    }
}

export async function verifyAuthorization(ctx){
    
    let tokenIsValid = true;
    
	if(ctx.header.authorization){
        const authorization = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/)
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