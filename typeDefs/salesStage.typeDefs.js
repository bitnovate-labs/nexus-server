import { gql } from "apollo-server-express";

export const salesStageTypeDefs = gql`
  type SalesStage {
    id: ID!
    salesType: SalesType!
    name: String!
    level: Int!
    active: Boolean!
    createdBy: User
    lastModifiedBy: User
  }

  enum SalesType {
    NONE
    SUBSALES
    RENT
    PROJECT
  }

  extend type Query {
    salesStages: [SalesStage!]!
    salesStage(id: ID!): SalesStage
  }

  extend type Mutation {
    createSalesStage(
      salesType: SalesType!
      name: String!
      level: Int!
      active: Boolean!
      createdBy: ID
      lastModifiedBy: ID
    ): SalesStage!

    updateSalesStage(
      id: ID!
      salesType: SalesType
      name: String
      level: Int
      active: Boolean
      lastModifiedBy: ID
    ): SalesStage!

    deleteSalesStages(ids: [ID!]!): Boolean!
  }
`;
