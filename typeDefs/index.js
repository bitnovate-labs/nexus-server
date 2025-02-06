import { gql } from "apollo-server-express";

import { agentCommissionTypeDefs } from "./agentCommission.typeDefs.js";
import { agentTypeDefs } from "./agent.typeDefs.js";
import { authTypeDefs } from "./auth.typeDefs.js";
import { bankAccountTypeDefs } from "./bankAccount.typeDefs.js";
import { bankTypeDefs } from "./bank.typeDefs.js";
import { branchTypeDefs } from "./branch.typeDefs.js";
import { companyTypeDefs } from "./company.typeDefs.js";
import { designationTypeDefs } from "./designation.typeDefs.js";
import { developerTypeDefs } from "./developer.typeDefs.js";
import { eventTypeDefs } from "./event.typeDefs.js";
import { memoTypeDefs } from "./memo.typeDefs.js";

import { stateTypeDefs } from "./state.typeDefs.js";
import { taxTypeDefs } from "./tax.typeDefs.js";
import { userTypeDefs } from "./user.typeDefs.js";
import { userRoleTypeDefs } from "./userRole.typeDefs.js";

import { projectTypeDefs } from "./projects/project.typeDefs.js";
import { projectCommissionSchemeTypeDefs } from "./projects/project.commissionScheme.typeDefs.js";
import { projectManagerCommissionTypeDefs } from "./projects/project.managerCommission.typeDefs.js";
import { projectScheduleTypeDefs } from "./projects/project.schedule.typeDefs.js";
import { projectUnitTypeTypeDefs } from "./projects/project.unitType.typeDefs.js";
import { salesStageTypeDefs } from "./salesStage.typeDefs.js";
import { purchaserTypeDefs } from "./purchaser.typeDefs.js";

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
  eventTypeDefs,
  memoTypeDefs,
  companyTypeDefs,
  bankAccountTypeDefs,
  taxTypeDefs,
  agentCommissionTypeDefs,
  projectUnitTypeTypeDefs,
  projectManagerCommissionTypeDefs,
  projectScheduleTypeDefs,
  projectCommissionSchemeTypeDefs,
  salesStageTypeDefs,
  purchaserTypeDefs,
];
