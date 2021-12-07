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
    userByNumber(number : String!): UserAuth!
    usersWithNumber(number : String!) : [UserAuth]!
  `;

export const userAuthMutations = `
    CreateUser(userAuth : UserAuthInput!) : UserAuth
`;

