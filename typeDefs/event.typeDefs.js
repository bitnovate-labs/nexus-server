import { gql } from "apollo-server-express";

export const eventTypeDefs = gql`
  type Event {
    id: ID!
    name: String!
    date: String!
    time: String
    venue: String
    speaker: String
    topic: String
    limitPax: Int
    designation: UserRole
    branch: Branch
    description: String
    createdBy: User!
    lastModifiedBy: User!
    attachments: [EventAttachment!]
  }

  type UserRole {
    id: ID!
    name: String!
  }

  type Branch {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
  }

  type EventAttachment {
    id: ID!
    filename: String!
    contentType: String!
    size: Int!
    url: String!
    createdAt: String!
    createdBy: User!
    lastModifiedAt: String!
    lastModifiedBy: User!
  }

  extend type Query {
    events: [Event!]!
    event(id: ID!): Event
  }

  extend type Mutation {
    createEvent(
      name: String!
      date: String!
      time: String
      venue: String
      speaker: String
      topic: String
      limitPax: Int
      designationId: ID
      branchId: ID
      description: String
    ): Event!

    updateEvent(
      id: ID!
      name: String
      date: String
      time: String
      venue: String
      speaker: String
      topic: String
      limitPax: Int
      designationId: ID
      branchId: ID
      description: String
    ): Event!

    deleteEvents(ids: [ID!]!): Boolean!
  }
`;
