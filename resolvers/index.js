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
import { eventResolvers } from "./eventResolvers.js";
import { eventAttachmentResolvers } from "./eventAttachmentResolvers.js";

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
    ...eventResolvers.Query,
    ...eventAttachmentResolvers.Query,
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
    ...eventResolvers.Mutation,
    ...eventAttachmentResolvers.Mutation,
    ...eventAttachmentResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
};
