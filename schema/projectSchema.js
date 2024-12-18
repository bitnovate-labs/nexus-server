import { gql } from "apollo-server-express";

export const projectTypeDefs = gql`
  scalar Upload

  type ProjectAttachment {
    id: ID!
    filename: String!
    mimeType: String!
    size: Int!
    category: String
    createdBy: User
    createdAt: String!
  }

  type ProjectUnitType {
    id: ID!
    name: String!
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  type ProjectSchedule {
    id: ID!
    name: String!
    sequence: Int!
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  type ProjectCommissionScheme {
    id: ID!
    projectId: ID
    unitType: ProjectUnitType
    fromDate: String
    toDate: String
    minUnit: Int
    maxUnit: Int
    commissionType: String
    commissionValue: Int
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  type AgentCommission {
    id: ID!
    commissionScheme: ProjectCommissionScheme!
    salesCommissionType: String!
    designation: Designation
    commissionType: String
    commissionValue: Int
    overriding: Boolean!
    schedulePaymentType: String
    schedulePaymentValue: Int
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  type ProjectManagerCommission {
    id: ID!
    commissionScheme: ProjectCommissionScheme!
    fromDate: String!
    toDate: String!
    commissionType: String!
    agent: Agent!
    commissionValue: Int!
    overriding: Boolean!
    schedulePaymentType: String
    schedulePaymentValue: Int
    createdBy: User
    createdAt: String!
    lastModifiedBy: User
    lastModifiedAt: String!
  }

  type ProjectPackage {
    id: ID!
    packageName: String!
    dateFrom: String!
    dateTo: String!
    deductFrom: String!
    amountType: String!
    amountValue: Int!
    deductType: String!
    displaySequence: Int!
    createdBy: User
    createdAt: String!
    lastModifiedBy: User
    lastModifiedAt: String!
  }

  type Project {
    id: ID!
    company: String!
    name: String!
    developer: Developer
    developerPayTax: Boolean
    state: State
    description: String
    active: Boolean
    createdBy: User
    createdAt: String!
    lastModifiedBy: User
    lastModifiedAt: String!
    unitTypes: [ProjectUnitType!]
    attachments: [ProjectAttachment!]
    schedules: [ProjectSchedule!]
    commissionSchemes: [ProjectCommissionScheme!]
    agentCommissions: [AgentCommission!]
    managerCommissions: [ProjectManagerCommission!]
    packages: [ProjectPackage!]
  }

  extend type Query {
    projects: [Project!]!
    project(id: ID!): Project
    projectUnitTypes(projectId: ID!): [ProjectUnitType!]!
    projectSchedules(projectId: ID!): [ProjectSchedule!]!
    projectCommissionSchemes(projectId: ID!): [ProjectCommissionScheme!]!
    agentCommissions(projectId: ID!): [AgentCommission!]!
    projectManagerCommissions(projectId: ID!): [ProjectManagerCommission!]!
    projectPackages(projectId: ID!): [ProjectPackage!]!
  }

  extend type Mutation {
    createProject(
      company: String!
      name: String!
      developerId: ID!
      developerPayTax: Boolean
      stateId: ID!
      description: String
      active: Boolean!
    ): Project!

    updateProject(
      id: ID!
      company: String
      name: String
      developerId: ID
      developerPayTax: Boolean
      stateId: ID
      description: String
      active: Boolean
    ): Project!

    deleteProjects(ids: [ID!]!): Boolean!

    uploadProjectAttachment(
      projectId: ID!
      file: Upload!
      category: String
    ): ProjectAttachment

    deleteProjectAttachment(id: ID!): Boolean!

    createProjectUnitType(projectId: ID!, name: String!): ProjectUnitType!

    updateProjectUnitType(id: ID!, name: String!): ProjectUnitType!

    deleteProjectUnitType(id: ID!): Boolean!

    createProjectSchedule(
      projectId: ID!
      name: String!
      sequence: Int!
    ): ProjectSchedule!

    updateProjectSchedule(
      id: ID!
      name: String
      sequence: Int
    ): ProjectSchedule!

    deleteProjectSchedule(id: ID!): Boolean!

    createProjectCommissionScheme(
      projectId: ID!
      unitTypeId: ID
      fromDate: String!
      toDate: String!
      minUnit: Int!
      maxUnit: Int!
      commissionType: String!
      commissionValue: Int!
    ): ProjectCommissionScheme!

    updateProjectCommissionScheme(
      id: ID!
      projectId: ID
      unitTypeId: ID
      fromDate: String
      toDate: String
      minUnit: Int
      maxUnit: Int
      commissionType: String
      commissionValue: Int
    ): ProjectCommissionScheme!

    deleteProjectCommissionScheme(id: ID!): Boolean!

    createAgentCommission(
      projectId: ID!
      commissionSchemeId: ID!
      salesCommissionType: String!
      designationId: ID
      commissionType: String!
      commissionValue: Int!
      overriding: Boolean!
      schedulePaymentType: String
      schedulePaymentValue: Int
    ): AgentCommission!

    updateAgentCommission(
      id: ID!
      salesCommissionType: String
      designationId: ID
      commissionType: String
      commissionValue: Int
      overriding: Boolean
      schedulePaymentType: String
      schedulePaymentValue: Int
    ): AgentCommission!

    deleteAgentCommission(id: ID!): Boolean!

    createProjectManagerCommission(
      projectId: ID!
      commissionSchemeId: ID!
      fromDate: String!
      toDate: String!
      commissionType: String!
      agentId: ID!
      commissionValue: Int!
      overriding: Boolean!
      schedulePaymentType: String
      schedulePaymentValue: Int
    ): ProjectManagerCommission!

    updateProjectManagerCommission(
      id: ID!
      fromDate: String
      toDate: String
      commissionType: String
      agentId: ID
      commissionValue: Int
      overriding: Boolean
      schedulePaymentType: String
      schedulePaymentValue: Int
    ): ProjectManagerCommission!

    deleteProjectManagerCommission(id: ID!): Boolean!

    createProjectPackage(
      projectId: ID!
      packageName: String!
      dateFrom: String!
      dateTo: String!
      deductFrom: String!
      amountType: String!
      amountValue: Int!
      deductType: String!
      displaySequence: Int!
    ): ProjectPackage!

    updateProjectPackage(
      id: ID!
      packageName: String
      dateFrom: String
      dateTo: String
      deductFrom: String
      amountType: String
      amountValue: Int
      deductType: String
      displaySequence: Int
    ): ProjectPackage!

    deleteProjectPackage(id: ID!): Boolean!
  }
`;
