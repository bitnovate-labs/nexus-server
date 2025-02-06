import { branchResolvers } from "./branchResolvers.js";
import { designationResolvers } from "./designationResolvers.js";
import { bankResolvers } from "./bankResolvers.js";
import { developerResolvers } from "./developerResolvers.js";
import { stateResolvers } from "./stateResolvers.js";
import { userRoleResolvers } from "./userRoleResolvers.js";
import { authResolvers } from "./authResolvers.js";
import { GraphQLUpload } from "graphql-upload-minimal";
import { eventResolvers } from "./eventResolvers.js";
import { memoResolvers } from "./memoResolvers.js";
import { companyResolvers } from "./companyResolvers.js";
import { bankAccountResolvers } from "./bankAccountResolvers.js";
import { taxResolvers } from "./taxResolvers.js";

import { agentResolvers } from "./agent.resolvers.js";
import { agentCommissionResolvers } from "./agentCommission.resolvers.js";
import { projectResolvers } from "./projects/project.resolvers.js";
import { projectUnitTypeResolvers } from "./projects/project.unitTypes.resolvers.js";
import { projectScheduleResolvers } from "./projects/project.schedule.resolvers.js";
import { projectCommissionSchemeResolvers } from "./projects/project.commissionScheme.resolvers.js";
import { projectManagerCommissionResolvers } from "./projects/project.managerCommission.resolvers.js";
import { purchasersResolvers } from "./purchasers.resolvers.js";
import { salesStageResolvers } from "./salesStage.resolvers.js";
import { userResolvers } from "./user.resolvers.js";

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
    ...authResolvers.Query,
    ...eventResolvers.Query,
    ...memoResolvers.Query,
    ...companyResolvers.Query,
    ...bankAccountResolvers.Query,
    ...taxResolvers.Query,

    ...agentCommissionResolvers.Query,
    ...projectResolvers.Query,
    ...projectUnitTypeResolvers.Query,
    ...projectScheduleResolvers.Query,
    ...projectCommissionSchemeResolvers.Query,
    ...projectManagerCommissionResolvers.Query,
    ...salesStageResolvers.Query,
    ...purchasersResolvers.Query,
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
    ...eventResolvers.Mutation,
    ...memoResolvers.Mutation,
    ...companyResolvers.Mutation,
    ...bankAccountResolvers.Mutation,
    ...taxResolvers.Mutation,

    ...agentCommissionResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...projectUnitTypeResolvers.Mutation,
    ...projectScheduleResolvers.Mutation,
    ...projectCommissionSchemeResolvers.Mutation,
    ...projectManagerCommissionResolvers.Mutation,
    ...salesStageResolvers.Mutation,
    ...purchasersResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Project: {
    ...projectResolvers.Project,
  },
  ProjectUnitType: {
    ...projectUnitTypeResolvers.ProjectUnitType,
  },
  ProjectSchedule: {
    ...projectScheduleResolvers.ProjectSchedule,
  },
  ProjectCommissionScheme: {
    ...projectCommissionSchemeResolvers.ProjectCommissionScheme,
  },
  AgentCommission: {
    ...agentCommissionResolvers.AgentCommission,
  },
  ProjectManagerCommission: {
    ...projectManagerCommissionResolvers.ProjectManagerCommission,
  },
  SalesStage: {
    ...salesStageResolvers.SalesStage,
  },
  Purchaser: {
    ...purchasersResolvers.Purchaser,
  },
  Agent: {
    ...agentResolvers.Agent,
  },
};
