import { gql } from "apollo-server-express";

export const agentTypeDefs = gql`
  scalar Upload

  type Agent {
    id: ID!
    # Personal Info
    name: String!
    displayName: String
    nricPassport: String
    email: String
    mobile: String
    address: String
    avatarUrl: String

    # Banking Info
    payeeName: String
    payeeNric: String
    payeeNricType: String
    bank: String
    bankAccountNo: String
    swiftCode: String

    # REN Tag
    renNo: String
    renLicense: String
    renExpiredDate: String

    # General Info
    branch: String
    leader: String
    recruiter: String
    designation: String
    commissionPercentage: Float
    joinDate: String
    resignDate: String
    incomeTaxNo: String
    withholdingTax: Boolean
    leaderboard: Boolean
    active: Boolean
    remark: String
  }

  extend type Query {
    agents: [Agent!]!
    agent(id: ID!): Agent
  }

  extend type Mutation {
    uploadAgentAvatar(id: ID!, file: Upload!): Agent!
    createAgent(
      # Personal Info
      name: String!
      displayName: String
      nricPassport: String
      email: String
      mobile: String
      address: String

      # Banking Info
      payeeName: String
      payeeNric: String
      payeeNricType: String
      bank: String
      bankAccountNo: String
      swiftCode: String

      # REN Tag
      renNo: String
      renLicense: String
      renExpiredDate: String

      # General Info
      branch: String
      leader: String
      recruiter: String
      designation: String
      commissionPercentage: Float
      joinDate: String
      resignDate: String
      incomeTaxNo: String
      withholdingTax: Boolean
      leaderboard: Boolean
      active: Boolean
      remark: String
    ): Agent!

    updateAgent(
      id: ID!
      # Personal Info
      name: String
      displayName: String
      nricPassport: String
      email: String
      mobile: String
      address: String

      # Banking Info
      payeeName: String
      payeeNric: String
      payeeNricType: String
      bank: String
      bankAccountNo: String
      swiftCode: String

      # REN Tag
      renNo: String
      renLicense: String
      renExpiredDate: String

      # General Info
      branch: String
      leader: String
      recruiter: String
      designation: String
      commissionPercentage: Float
      joinDate: String
      resignDate: String
      incomeTaxNo: String
      withholdingTax: Boolean
      leaderboard: Boolean
      active: Boolean
      remark: String
    ): Agent!

    deleteAgents(ids: [ID!]!): Boolean!
  }
`;
