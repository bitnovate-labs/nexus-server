import { gql } from "apollo-server-express";

export const purchaserTypeDefs = gql`
  type Purchaser {
    id: ID!
    name: String!
    registrationNo: String!
    address: String
    contactPerson: String
    contactNo: String
    email: String
    createdBy: User
    lastModifiedBy: User
  }

  extend type Query {
    purchasers: [Purchaser!]!
    purchaser(id: ID!): Purchaser
  }

  extend type Mutation {
    createPurchaser(
      name: String!
      registrationNo: String!
      address: String
      contactPerson: String
      contactNo: String
      email: String
      createdBy: ID
      lastModifiedBy: ID
    ): Purchaser!

    updatePurchaser(
      id: ID!
      name: String
      registrationNo: String
      address: String
      contactPerson: String
      contactNo: String
      email: String
      lastModifiedBy: ID
    ): Purchaser!

    deletePurchasers(ids: [ID!]!): Boolean!
  }
`;
