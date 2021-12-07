export const callTypeDef = `
  type call {
    call_id: Int!
    
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }

  input CallInput {
    call_date: String!
    call_started: String!
    call_finished: String!
    call_duration: String!
  }`;

export const callQueries = `
  getAllCall: [call]!

`;

export const callMutations = `
  save(call: CallInput!): String!
  deleteCall(id: Int!) : String!
 
`;