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

        client.bind('cn=admin,dc=iris,dc=com', 'admin', (error)=>{
            if(!error){
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
        
        let newDN = `cn=${name},ou=sa,dc=iris,dc=com`;
        console.log(newDN, userId, name)
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
            objectClass: 'inetOrgPerson'
        }

        client.bind('cn=admin,dc=iris,dc=com', 'admin', (error)=>{
            if(!error){
                console.log("Conexión realizada")
                client.add(newDN, newUser, (error) => {
                    if(!error){
                        console.log("Cliente agregado")
                        client.search('dc=iris,dc=com', opts, (error, res) => {
                            if(!error){
                                console.log("Buscando")
                                res.on('searchEntry', (entry) => { user = entry.object });
                                res.on('error', function(err){ reject(err) });
                                res.on('end', function(result){ resolve(user) });
                            }
                        })
                    }
                });
            }
        });
    });
}