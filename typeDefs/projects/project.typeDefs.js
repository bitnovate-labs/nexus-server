import { gql } from "apollo-server-express";

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    companyId: ID!
    company: Company!
    name: String!
    developerId: ID!
    developer: Developer!
    developerPayTax: Boolean
    stateId: ID!
    state: State!
    description: String
    active: Boolean
    unitTypes: [ProjectUnitType!]
    schedules: [ProjectSchedule!]
    commissionSchemes: [ProjectCommissionScheme!]
    agentCommissions: [AgentCommission!]
    managerCommissions: [ProjectManagerCommission!]
    createdAt: String
    createdBy: User
    lastModifiedAt: String
    lastModifiedBy: User
  }

  extend type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(
      companyId: ID!
      name: String!
      developerId: ID!
      developerPayTax: Boolean
      stateId: ID!
      description: String
      active: Boolean!
    ): Project!

    updateProject(
      id: ID!
      companyId: ID
      name: String
      developerId: ID
      developerPayTax: Boolean
      stateId: ID
      description: String
      active: Boolean
    ): Project!

    deleteProjects(ids: [ID!]!): Boolean!
  }
`;
