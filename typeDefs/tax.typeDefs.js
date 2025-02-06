import { gql } from "apollo-server-express";

export const taxTypeDefs = gql`
  type Tax {
    id: ID!
    code: String!
    name: String!
    taxType: String!
    rate: String!
    taxDefault: Boolean!
    createdBy: User!
    lastModifiedBy: User!
  }

  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    taxes: [Tax!]!
    tax(id: ID!): Tax
  }

  extend type Mutation {
    createTax(
      code: String!
      name: String!
      taxType: String!
      rate: String!
      taxDefault: Boolean!
    ): Tax!

    updateTax(
      id: ID!
      code: String
      name: String
      taxType: String
      rate: String
      taxDefault: Boolean
    ): Tax!

    deleteTaxes(ids: [ID!]!): Boolean!
  }
`;
