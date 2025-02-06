import { gql } from "apollo-server-express";

export const companyTypeDefs = gql`
  type Company {
    id: ID!
    name: String!
    displayName: String!
    registrationNo: String
    licenseNo: String
    incomeTaxNo: String
    address: String!
    contactNo: String
    fax: String
    email: String
    website: String
    sst: Boolean!
    sstNo: String
    personInCharge: String
    personInChargeNric: String
    personInChargeDesignation: String
    createdBy: User
    lastModifiedBy: User
    # A company can have multiple projects
    projects: [Project!]!
  }

  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    companies: [Company!]!
    company(id: ID!): Company
  }

  extend type Mutation {
    createCompany(
      name: String!
      displayName: String!
      registrationNo: String
      licenseNo: String
      incomeTaxNo: String
      address: String!
      contactNo: String
      fax: String
      email: String
      website: String
      sst: Boolean!
      sstNo: String
      personInCharge: String
      personInChargeNric: String
      personInChargeDesignation: String
    ): Company!

    updateCompany(
      id: ID!
      name: String
      displayName: String
      registrationNo: String
      licenseNo: String
      incomeTaxNo: String
      address: String
      contactNo: String
      fax: String
      email: String
      website: String
      sst: Boolean!
      sstNo: String
      personInCharge: String
      personInChargeNric: String
      personInChargeDesignation: String
    ): Company!

    deleteCompanies(ids: [ID!]!): Boolean!
  }
`;
