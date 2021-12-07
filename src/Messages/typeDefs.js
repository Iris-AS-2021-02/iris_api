export const messageTypeDef = `
  type Message {
      id: String!
      sender: String!
      receiver: String!
      content: String!
      time_sent: String
      time_received: String
      time_seen: String
  }
  input MessageInput {
    receiver: String!
    content: String!
  }
  input ConversationInput {
    receiver: String!
    sender: String!
  }
  `;

export const messageQueries = `
    receiveMessage(input: ConversationInput): [Message]
  `;

export const messageMutations = `
    sendMessage(message: MessageInput!): Message!
    deleteMessage(id: String!): String
    updateSeen(id:String!): String
`;

