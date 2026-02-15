import { gql } from "@apollo/client";

import adminUsersSampleGql from "./queries/admin-users-sample.gql?raw";

export const GET_ADMIN_USERS_SAMPLE = gql(adminUsersSampleGql);
