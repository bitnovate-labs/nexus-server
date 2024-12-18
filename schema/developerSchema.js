import { gql } from "apollo-server-express";

export const developerTypeDefs = gql`
  type Developer {
    id: ID!
    name: String!
    registrationNo: String
    address: String
    contactPerson: String
    contactNo: String
  }

  extend type Query {
    developers: [Developer!]!
    developer(id: ID!): Developer
  }

  extend type Mutation {
    createDeveloper(
      name: String!
      registrationNo: String
      address: String
      contactPerson: String
      contactNo: String
    ): Developer!

    updateDeveloper(
      id: ID!
      name: String
      registrationNo: String
      address: String
      contactPerson: String
      contactNo: String
    ): Developer!

    deleteDevelopers(ids: [ID!]!): Boolean!
  }
`;
