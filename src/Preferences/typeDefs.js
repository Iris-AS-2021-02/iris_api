export const userPreferenceTypeDef = `
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

export const userPreferenceQueries = `
allusersettings: [UserPreference]
usersettingbyid(id : String!): UserPreference
  `;

export const userPreferenceMutations = `
usersetting(UserPreference : UserPreferenceInput!) : UserPreference
`;
