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
    designation: String
    branch: String
    description: String
    createdAt: String
    createdBy: String
    lastModifiedAt: String
    lastModifiedBy: String
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
      designation: String
      branch: String
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
      designation: String
      branch: String
      description: String
    ): Event!

    deleteEvents(ids: [ID!]!): Boolean!
  }
`;
