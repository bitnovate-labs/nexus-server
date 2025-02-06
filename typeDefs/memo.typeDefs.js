import { gql } from "apollo-server-express";

export const memoTypeDefs = gql`
  type Memo {
    id: ID!
    date: String!
    title: String!
    validityFrom: String
    validityTo: String
    branch: Branch
    designation: Designation
    description: String
    createdBy: User!
    lastModifiedBy: User!
    attachments: [MemoAttachment!]
  }

  type Branch {
    id: ID!
    name: String!
  }

  type Designation {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
  }

  type MemoAttachment {
    id: ID!
    filename: String!
    contentType: String!
    size: Int!
    url: String!
    createdAt: String!
    createdBy: User!
    lastModifiedAt: String!
    lastModifiedBy: User!
  }

  extend type Query {
    memos: [Memo!]!
    memo(id: ID!): Memo
  }

  extend type Mutation {
    createMemo(
      date: String!
      title: String!
      validityFrom: String
      validityTo: String
      branchId: ID
      designationId: ID
      description: String
    ): Memo!

    updateMemo(
      id: ID!
      date: String
      title: String
      validityFrom: String
      validityTo: String
      branchId: ID
      designationId: ID
      description: String
    ): Memo!

    deleteMemos(ids: [ID!]!): Boolean!
  }
`;
