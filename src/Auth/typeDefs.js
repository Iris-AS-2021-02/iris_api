
export const userAuthTypeDef = `
  type UserAuth{
      ID: String
      Name: String
      Number: String
			Password: String
  }
  input UserAuthInput {
    Name: String
    Number: String
		Password: String
  }`;

export const userAuthQueries = `
    allUsers: [UserAuth]
    usersByNumber(number : String!): UserAuth
    usersWithNumber(number : String!) : [UserAuth]
  `;

export const userAuthMutations = `
    createUser(userAuth : UserAuthInput!) : UserAuth
`;

