import { gql } from "apollo-server-express";

export const designationTypeDefs = gql`
  type Designation {
    id: ID!
    name: String!
    rank: Int!
    active: Boolean!
  }

  extend type Query {
    designations: [Designation!]!
    designation(id: ID!): Designation
  }

  extend type Mutation {
    createDesignation(name: String!, rank: Int!, active: Boolean!): Designation!

    updateDesignation(
      id: ID!
      name: String
      rank: Int
      active: Boolean
    ): Designation!

    deleteDesignation(ids: [ID!]!): Boolean!
  }
`;
