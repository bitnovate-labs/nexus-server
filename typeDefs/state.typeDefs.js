import { gql } from "apollo-server-express";

export const stateTypeDefs = gql`
  type State {
    id: ID!
    name: String!
    code: String!
    country: String!
  }

  extend type Query {
    states: [State!]!
    state(id: ID!): State
  }

  extend type Mutation {
    createState(name: String!, code: String!, country: String!): State!

    updateState(id: ID!, name: String, code: String, country: String): State!

    deleteStates(ids: [ID!]!): Boolean!
  }
`;
