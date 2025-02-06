import { gql } from "apollo-server-express";

export const projectManagerCommissionTypeDefs = gql`
  type ProjectManagerCommission {
    id: ID!
    projectId: ID!
    project: Project!
    commissionSchemeId: ID
    commissionScheme: ProjectCommissionScheme
    fromDate: String!
    toDate: String!
    salesCommissionType: SalesCommissionType!
    agentId: ID!
    agent: Agent!
    commissionType: CommissionValueType!
    commissionValue: Float!
    overriding: Boolean!
    schedulePaymentType: CommissionValueType
    schedulePaymentValue: Float
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  enum CommissionValueType {
    PERCENTAGE
    RM
  }

  enum SalesCommissionType {
    NONE
    PROJECT_MANAGER_OVERRIDING
  }

  extend type Query {
    projectManagerCommissions(
      projectId: ID!
      agentId: ID
      salesCommissionType: SalesCommissionType
    ): [ProjectManagerCommission!]!
    projectManagerCommission(id: ID!): ProjectManagerCommission
  }

  extend type Mutation {
    createProjectManagerCommission(
      projectId: ID!
      commissionSchemeId: ID
      fromDate: String!
      toDate: String!
      salesCommissionType: SalesCommissionType!
      agentId: ID!
      commissionType: CommissionValueType!
      commissionValue: Float!
      overriding: Boolean!
      schedulePaymentType: CommissionValueType
      schedulePaymentValue: Float
    ): ProjectManagerCommission!

    updateProjectManagerCommission(
      id: ID!
      commissionSchemeId: ID
      fromDate: String
      toDate: String
      salesCommissionType: SalesCommissionType
      agentId: ID
      commissionType: CommissionValueType
      commissionValue: Float
      overriding: Boolean
      schedulePaymentType: CommissionValueType
      schedulePaymentValue: Float
    ): ProjectManagerCommission!

    deleteProjectManagerCommission(id: ID!): Boolean!
  }
`;
