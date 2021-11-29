export const messageTypeDef = `
  type Message {
      id: String!
      sender: User!
      receiver: User!
      content: String!
      time_sent: String
      time_received: String
      time_seen: String
  }
  input MessageInput {
    receiver: User!
    content: String!
  }
  input ConversationInput {
    receiver: User!
    sender: User!
  }`;

export const messageQueries = `
    messages(input: ConversationInput): [Messages]
  `;

export const messageMutations = `
    createMessage(message: MessageInput!): Message!
    deleteMessage(id: String!): String
`;

