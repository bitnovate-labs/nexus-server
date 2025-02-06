import { gql } from "apollo-server-express";

export const bankAccountTypeDefs = gql`
  type BankAccount {
    id: ID!
    company: Company
    bank: Bank
    name: String!
    bankAccountNo: String
    bankAccountType: String!
    payment: Boolean!
    receipt: Boolean!
    createdBy: User!
    lastModifiedBy: User!
  }

  type Company {
    id: ID!
    name: String!
  }

  type Bank {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    bankAccounts: [BankAccount!]!
    bankAccount(id: ID!): BankAccount
  }

  extend type Mutation {
    createBankAccount(
      companyId: ID!
      bankId: ID!
      name: String!
      bankAccountNo: String
      bankAccountType: String!
      payment: Boolean!
      receipt: Boolean!
    ): BankAccount!

    updateBankAccount(
      id: ID!
      companyId: ID
      bankId: ID
      name: String
      bankAccountNo: String
      bankAccountType: String
      payment: Boolean
      receipt: Boolean
    ): BankAccount!

    deleteBankAccounts(ids: [ID!]!): Boolean!
  }
`;
