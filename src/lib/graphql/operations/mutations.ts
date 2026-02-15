import { gql } from "@apollo/client";

import createWorkspaceGql from "./mutations/create-workspace.gql?raw";

export const CREATE_WORKSPACE = gql(createWorkspaceGql);
