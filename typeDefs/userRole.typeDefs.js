import { gql } from "apollo-server-express";

export const userRoleTypeDefs = gql`
  type UserRole {
    id: ID!
    code: String!
    name: String!
    active: Boolean!
  }

  extend type Query {
    userRoles: [UserRole!]!
    userRole(id: ID!): UserRole
  }

  extend type Mutation {
    createUserRole(code: String!, name: String!, active: Boolean!): UserRole!

    updateUserRole(
      id: ID!
      code: String
      name: String
      active: Boolean
    ): UserRole!

    deleteUserRoles(ids: [ID!]!): Boolean!
  }
`;
