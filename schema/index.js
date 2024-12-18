import { gql } from "apollo-server-express";
import { userTypeDefs } from "./userSchema.js";
import { agentTypeDefs } from "./agentSchema.js";
import { branchTypeDefs } from "./branchSchema.js";
import { projectTypeDefs } from "./projectSchema.js";
import { designationTypeDefs } from "./designationSchema.js";
import { bankTypeDefs } from "./bankSchema.js";
import { developerTypeDefs } from "./developerSchema.js";
import { stateTypeDefs } from "./stateSchema.js";
import { userRoleTypeDefs } from "./userRoleSchema.js";
import { authTypeDefs } from "./authSchema.js";

const baseTypeDefs = gql`
  scalar Upload

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  agentTypeDefs,
  branchTypeDefs,
  projectTypeDefs,
  designationTypeDefs,
  bankTypeDefs,
  developerTypeDefs,
  stateTypeDefs,
  userRoleTypeDefs,
  authTypeDefs,
];
