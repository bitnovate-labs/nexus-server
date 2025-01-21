import { gql } from "apollo-server-express";

export const eventAttachmentTypeDefs = gql`
  type EventAttachment {
    id: ID!
    eventId: ID!
    filename: String!
    contentType: String!
    size: Int!
    url: String!
    createdAt: String
    createdBy: String
    lastModifiedAt: String
    lastModifiedBy: String
  }

  extend type Query {
    eventAttachments(eventId: ID!): [EventAttachment!]!
  }

  extend type Mutation {
    uploadEventAttachment(eventId: ID!, file: Upload!): EventAttachment!
    deleteEventAttachment(id: ID!): Boolean!
  }
`;
