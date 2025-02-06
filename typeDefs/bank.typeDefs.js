import { gql } from "apollo-server-express";

export const bankTypeDefs = gql`
  type Bank {
    id: ID!
    name: String!
    swiftCode: String
    active: Boolean!
  }

  extend type Query {
    banks: [Bank!]!
    bank(id: ID!): Bank
  }

  extend type Mutation {
    createBank(name: String!, swiftCode: String, active: Boolean!): Bank!

    updateBank(id: ID!, name: String, swiftCode: String, active: Boolean): Bank!

    deleteBanks(ids: [ID!]!): Boolean!
  }
`;
