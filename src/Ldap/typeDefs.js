export const ldapTypeDef = `
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

export const ldapQueries = `
        verifyConnection: String
    `;

export const ldapMutations = `
        createLdapUser(account: Account!): LdapUser!
        getLdapUser(userAccount: UserAccount!): LdapUser!
        modifyLdapUser(account: Account!): LdapUser!
        deleteLdapUser(userAccount: UserAccount!): String!
        verifyAccount(account: Account!): ValidationMessage!
    `;