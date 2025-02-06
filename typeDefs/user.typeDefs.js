import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    mobile: String
    role: String
    active: Boolean!
    avatarUrl: String
    agent: Agent
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User
    users: [User!]!
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthPayload!
    changePassword(oldPassword: String!, newPassword: String!): Boolean!
    uploadAvatar(file: Upload!): User!

    createUser(
      name: String!
      username: String!
      password: String!
      email: String!
      mobile: String
      role: String
      active: Boolean!
    ): User!

    updateUser(
      id: ID!
      name: String
      username: String
      email: String
      mobile: String
      role: String
      active: Boolean
    ): User!

    deleteUsers(ids: [ID!]!): Boolean!
  }
`;
