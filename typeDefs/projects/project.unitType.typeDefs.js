import { gql } from "apollo-server-express";

export const projectUnitTypeTypeDefs = gql`
  type ProjectUnitType {
    id: ID!
    projectId: ID!
    project: Project!
    name: String!
    createdAt: String
    createdBy: User
    lastModifiedAt: String
    lastModifiedBy: User
  }

  extend type Query {
    projectUnitTypes(projectId: ID!): [ProjectUnitType!]!
    projectUnitType(id: ID!): ProjectUnitType
  }

  extend type Mutation {
    createProjectUnitType(projectId: ID!, name: String!): ProjectUnitType!

    updateProjectUnitType(id: ID!, name: String!): ProjectUnitType!

    deleteProjectUnitType(id: ID!): Boolean!
  }
`;
