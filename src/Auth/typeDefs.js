export const userAuthTypeDef = `
  type UserAuth{
      id: ID!
      Name: String!
      Number: String!
  }
  input UserAuthInput {
    Name: String!
    Number: String!
  }`;

export const userAuthQueries = `
    allUsers: [UserAuth]!
    usersByNumber(number : String!): UserAuth!
    usersWithNumber(number : String!) : [UserAuth]!
  `;

export const userAuthMutations = `
    createUser(userAuth : UserAuthInput!) : UserAuth
`;

