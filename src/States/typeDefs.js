
export const stateTypeDef = `
  type State{

      id: String!
      serialNumber: String!
      type: String
      publicationDate: String!
      style: String!
      commentary: String
      imageFile: String
      user_id: String!
      created_at: String
      
  }

  type User{

      id: String!
      userIdNumber: String!
      name: String!
      created_at: String!
    
  }

  type resValidation{

    res: String!
    message: String!
  
  }

  input StateInput {
      serialNumber: String!
      type: String!
      publicationDate: String!
      style: String
      commentary: String
      imageFile: String
      user_id: String
  }

  input UserInput {
      userIdNumber: String!
      name: String!
}`;

export const stateQueries = `
      getAllStates: [State]
      getUserStates(id: String!): State
      getAllStateUsers(id: String!): User
  `;

export const stateMutations = `
      createState(stateInfo: StateInput!) : resValidation
      createUser(userInfo: UserInput!) : resValidation
      updateState(stateInfo: StateInput!) : resValidation
      deleteState(id: String!) : resValidation
      deleteUser(id: String!) : resValidation
  `;

