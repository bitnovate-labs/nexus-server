import { gql } from "apollo-server-express";

export const agentCommissionTypeDefs = gql`
  type AgentCommission {
    id: ID!
    projectId: ID!
    project: Project!
    commissionSchemeId: ID
    commissionScheme: ProjectCommissionScheme
    salesCommissionType: SalesCommissionType!
    designationId: ID!
    designation: Designation!
    commissionType: CommissionValueType!
    commissionValue: Float!
    overriding: Boolean!
    schedulePaymentType: CommissionValueType
    schedulePaymentValue: Float
    createdBy: User
    lastModifiedBy: User
    createdAt: String
    lastModifiedAt: String
  }

  enum CommissionValueType {
    PERCENTAGE
    RM
  }

  enum SalesCommissionType {
    PROJECT_OVERRIDING
    UPLINE_OVERRIDING
  }

  extend type Query {
    agentCommissions(
      projectId: ID!
      designationId: ID
      salesCommissionType: SalesCommissionType
    ): [AgentCommission!]!
    agentCommission(id: ID!): AgentCommission
  }

  extend type Mutation {
    createAgentCommission(
      projectId: ID!
      commissionSchemeId: ID
      salesCommissionType: SalesCommissionType!
      designationId: ID
      commissionType: CommissionValueType!
      commissionValue: Float!
      overriding: Boolean!
      schedulePaymentType: CommissionValueType
      schedulePaymentValue: Float
    ): AgentCommission!

    updateAgentCommission(
      id: ID!
      commissionSchemeId: ID
      salesCommissionType: SalesCommissionType
      designationId: ID
      commissionType: CommissionValueType
      commissionValue: Float
      overriding: Boolean
      schedulePaymentType: CommissionValueType
      schedulePaymentValue: Float
    ): AgentCommission!

    deleteAgentCommission(id: ID!): Boolean!
  }
`;
