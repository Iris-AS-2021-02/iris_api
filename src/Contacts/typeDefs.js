export const contactTypeDef = `
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

export const contactQueries = `
        contactsByUserId(userId: String!): [Contact]!
        contactById(contactId: String!): Contact!
    `;

export const contactMutations = `
        syncronize(userId: String!, phoneContacts: [ContactEntry]!): [Contact]!
        setSettings(contactSettings: ContactSettingsInput!): ContactSettings!
    `;