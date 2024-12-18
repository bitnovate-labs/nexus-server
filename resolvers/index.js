import { userResolvers } from "./userResolvers.js";
import { agentResolvers } from "./agentResolvers.js";
import { branchResolvers } from "./branchResolvers.js";
import { designationResolvers } from "./designationResolvers.js";
import { bankResolvers } from "./bankResolvers.js";
import { developerResolvers } from "./developerResolvers.js";
import { stateResolvers } from "./stateResolvers.js";
import { userRoleResolvers } from "./userRoleResolvers.js";
import { projectResolvers } from "./projectResolvers.js";
import { authResolvers } from "./authResolvers.js";
import { GraphQLUpload } from "graphql-upload-minimal";

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...userResolvers.Query,
    ...agentResolvers.Query,
    ...branchResolvers.Query,
    ...designationResolvers.Query,
    ...bankResolvers.Query,
    ...developerResolvers.Query,
    ...stateResolvers.Query,
    ...userRoleResolvers.Query,
    ...projectResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...agentResolvers.Mutation,
    ...branchResolvers.Mutation,
    ...designationResolvers.Mutation,
    ...bankResolvers.Mutation,
    ...developerResolvers.Mutation,
    ...stateResolvers.Mutation,
    ...userRoleResolvers.Mutation,
    ...projectResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
};
