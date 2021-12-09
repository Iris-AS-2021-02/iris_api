export const callTypeDef = `
  type call {
    call_id: Int!
    userId: String!
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }

  input CallInput {
    userId: String!
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }`;

export const callQueries = `
  getAllCall: [call]!
  getcallsUser(userId: String!): [call]!

`;

export const callMutations = `
  save(call: CallInput!): String!
  deleteCall(id: Int!) : String!
 
`;