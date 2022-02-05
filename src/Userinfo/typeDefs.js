export const userInfoTypeDef = `
  type Response{
      id: Int
      name: String
      about: String
      cel: String
  }

  type UserResponse{
      _id: ID 
      id: Int
      name: String
      about: String
      cel: String
  }

  input UserIn{
      id: Int
      name: String
      about: String
      cel: String
  }

 `;

export const userInfoQueries = `
    userByNumber(id: Int!): UserResponse
  `;

export const userInfoMutations = `
    createUserInfo(request: UserIn!) : Response
    updateUserName(request: UserIn!) : Response
    updateUserAbout(request: UserIn!) : Response
    updateUserCel(request: UserIn!) : Response
`;
