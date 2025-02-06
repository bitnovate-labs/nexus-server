import { gql } from "apollo-server-express";

export const authTypeDefs = gql`
  type TokenInfo {
    expiresIn: Int!
    warningTime: Int!
  }

  extend type Query {
    tokenInfo: TokenInfo!
  }
`;
