import { gql } from "apollo-server-express";

export const agentTypeDefs = gql`
  scalar Upload

  type Agent {
    id: ID!
    name: String!
    displayName: String
    nricPassport: String
    email: String
    mobile: String
    address: String
    avatarUrl: String
    payeeName: String
    payeeNric: String
    payeeNricType: String
    bank: String
    bankAccountNo: String
    swiftCode: String
    renNo: String
    renLicense: String
    renExpiredDate: String
    branch: String
    leaderId: ID
    recruiterId: ID
    leader: Agent
    recruiter: Agent
    designation: String
    commissionPercentage: Float
    joinDate: String
    resignDate: String
    incomeTaxNo: String
    withholdingTax: Boolean
    leaderboard: Boolean
    active: Boolean
    remark: String
    createdBy: User
    lastModifiedBy: User
  }

  extend type Query {
    agents: [Agent!]!
    agent(id: ID!): Agent
  }

  extend type Mutation {
    uploadAgentAvatar(id: ID!, file: Upload!): Agent!
    createAgent(
      name: String!
      displayName: String
      nricPassport: String
      email: String
      mobile: String
      address: String
      payeeName: String
      payeeNric: String
      payeeNricType: String
      bank: String
      bankAccountNo: String
      swiftCode: String
      renNo: String
      renLicense: String
      renExpiredDate: String
      branch: String
      leaderId: ID
      recruiterId: ID
      designation: String
      commissionPercentage: Float
      joinDate: String
      resignDate: String
      incomeTaxNo: String
      withholdingTax: Boolean
      leaderboard: Boolean
      active: Boolean
      remark: String
      createdBy: ID
      lastModifiedBy: ID
    ): Agent!

    updateAgent(
      id: ID!
      name: String
      displayName: String
      nricPassport: String
      email: String
      mobile: String
      address: String
      payeeName: String
      payeeNric: String
      payeeNricType: String
      bank: String
      bankAccountNo: String
      swiftCode: String
      renNo: String
      renLicense: String
      renExpiredDate: String
      branch: String
      leaderId: ID
      recruiterId: ID
      designation: String
      commissionPercentage: Float
      joinDate: String
      resignDate: String
      incomeTaxNo: String
      withholdingTax: Boolean
      leaderboard: Boolean
      active: Boolean
      remark: String
      createdBy: ID
      lastModifiedBy: ID
    ): Agent!

    deleteAgents(ids: [ID!]!): Boolean!
  }
`;
