import { gql } from "apollo-server-express";

export const branchTypeDefs = gql`
  type Branch {
    id: ID!
    name: String!
    maxAgents: Int
    active: Boolean!
  }

  extend type Query {
    branches: [Branch!]!
    branch(id: ID!): Branch
  }

  extend type Mutation {
    createBranch(name: String!, maxAgents: Int, active: Boolean!): Branch!
    updateBranch(
      id: ID!
      name: String
      maxAgents: Int
      active: Boolean
    ): Branch!
    deleteBranch(id: ID!): Boolean!
  }
`;
