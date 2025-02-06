import { gql } from "apollo-server-express";

export const projectCommissionSchemeTypeDefs = gql`
  type ProjectCommissionScheme {
    id: ID!
    projectId: ID!
    project: Project!
    unitTypeId: ID!
    unitType: ProjectUnitType!
    fromDate: String!
    toDate: String!
    minUnit: Int!
    maxUnit: Int!
    commissionType: CommissionValueType!
    commissionValue: Float!
    createdBy: User
    lastModifiedBy: User
    createdAt: String
    lastModifiedAt: String
  }

  enum CommissionValueType {
    PERCENTAGE
    RM
  }

  extend type Query {
    projectCommissionSchemes(projectId: ID!): [ProjectCommissionScheme!]!
    projectCommissionScheme(id: ID!): ProjectCommissionScheme
  }

  extend type Mutation {
    createProjectCommissionScheme(
      projectId: ID!
      unitTypeId: ID!
      fromDate: String!
      toDate: String!
      minUnit: Int!
      maxUnit: Int!
      commissionType: CommissionValueType!
      commissionValue: Float!
    ): ProjectCommissionScheme!

    updateProjectCommissionScheme(
      id: ID!
      unitTypeId: ID
      fromDate: String
      toDate: String
      minUnit: Int
      maxUnit: Int
      commissionType: CommissionValueType
      commissionValue: Float
    ): ProjectCommissionScheme!

    deleteProjectCommissionScheme(id: ID!): Boolean!
  }
`;
