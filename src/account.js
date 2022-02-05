import { url, port, entryPoint } from './Auth/server';
import { ldapUrl, ldapPort, ldapEntryPoint } from './Ldap/server';

const jwt = require("jsonwebtoken");
const axios = require("axios")

const secretOrPrivateKey = 'secretKey';
const UserURL = `http://${url}:${port}/${entryPoint}`;
const LdapURL = `http://${ldapUrl}:${ldapPort}/${ldapEntryPoint}`;

export async function login(ctx){
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

export async function register(ctx){
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

export async function verifyToken(ctx){
    
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