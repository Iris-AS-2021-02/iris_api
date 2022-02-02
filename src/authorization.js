import { url, port, entryPoint } from './Auth/server';
import { searchUserLDAP, createUserLDAP } from './Ldap/ldap'
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

        console.log(data);
        
        ctx.response.status = 401;
        ctx.response.body = { success: false, token: null };
        
        if(data.Name === payload.name){
            
            let user = await searchUserLDAP(payload.phone);
            console.log(user);
                if(user.userPassword === payload.name){
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

export async function register(ctx){
    const user = { Name: ctx.request.body.name, Number: ctx.request.body.phone };
    const URL = `http://${url}:${port}/${entryPoint}`;
    
    try{
        let response = await axios.post(URL, user);
        let data = response.data;
        console.log(data);

        if (data.ID != null){
            let createdUser = await createUserLDAP(user.Number, user.Name);
            console.log(user);

            if(createdUser != null){
                ctx.response.status = 200;
                ctx.response.body = { success: true, user: data };
            }
            else
                throw new Error("User not created in active directory")
            }
        else
            throw new Error("User not created in Iris auth ms")
    }
    catch(e){
        ctx.response.status = 400;
        ctx.response.body = { success: false, user: null };
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