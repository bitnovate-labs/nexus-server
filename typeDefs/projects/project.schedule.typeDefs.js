import { gql } from "apollo-server-express";

export const projectScheduleTypeDefs = gql`
  type ProjectSchedule {
    id: ID!
    projectId: ID!
    project: Project!
    name: String!
    sequence: Int!
    createdBy: User
    createdAt: String
    lastModifiedBy: User
    lastModifiedAt: String
  }

  extend type Query {
    projectSchedules(projectId: ID!): [ProjectSchedule!]!
    projectSchedule(id: ID!): ProjectSchedule
  }

  extend type Mutation {
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
  }
`;
