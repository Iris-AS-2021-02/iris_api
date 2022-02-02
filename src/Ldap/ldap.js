import { url, port } from './server';
const ssha = require('node-ssha256');
const express = require('express');
const app = express();
const ldap = require('ldapjs')
const URL = `ldap://${url}:${port}`;

export function searchUserLDAP(userId){
    return new Promise((resolve, reject) => {
        let user = null;
        let opts = {
            filter: `(&(objectClass=inetOrgPerson)(uid=${userId}))`,
            scope: 'sub',
            attributes: []
        }

        let client = ldap.createClient({
            url: URL
        });

        client.bind('cn=admin,dc=iris,dc=com', 'admin', (error, res)=>{
            if(error){
                resolve(error);
            }
            else{
                console.log(res);
                client.search('dc=iris,dc=com', opts, (error, res) => {
                    res.on('searchEntry', (entry) => { user = entry.object });
                    res.on('error', function(err){ reject(err) });
                    res.on('end', function(result){ resolve(user) });
                })
            }
        });
    });
}

export function createUserLDAP(userId, name){
    return new Promise((resolve, reject) => {
        let user = null;
        let client = ldap.createClient({
            url: URL
        });
        
        let cn = userId;
        if(userId.includes('+')){
            cn = userId.split('+')[1];
        }

        let newDN = `cn=${cn},ou=sa,dc=iris,dc=com`;
        
        let fullName = name.split(' ');
        let firstName = fullName[0];
        let lastName = '';

        if(fullName.length > 1)
            lastName = fullName[1];

        let newUser = {
            givenname: firstName,
            sn: lastName,
            cn: name,
            uid: userId,
            userPassword: name,
            objectClass: [ 'inetOrgPerson', 'top' ]
        }

        client.bind('cn=admin,dc=iris,dc=com', 'admin', (err)=>{
            if(err){
                reject(err);
            }
            else{
                client.add(newDN, newUser, (err) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        let opts = {
                            filter: `(&(objectClass=inetOrgPerson)(uid=${userId}))`,
                            scope: 'sub',
                            attributes: []
                        }
                        client.search('dc=iris,dc=com', opts, (error, res) => {
                            if(error){
                                reject(error);
                            }
                            else{
                                res.on('searchEntry', (entry) => { user = entry.object });
                                res.on('error', err => { reject(err) });
                                res.on('end', () => { resolve(user) });
                            }
                        })
                    }
                });
            }
        });
    });
}