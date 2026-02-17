import { gql } from "@apollo/client";

import adminUsersSampleGql from "./queries/admin-users-sample.gql?raw";
import viewerBootstrapGql from "./queries/viewer-bootstrap.gql?raw";

export const GET_ADMIN_USERS_SAMPLE = gql(adminUsersSampleGql);
export const VIEWER_BOOTSTRAP = gql(viewerBootstrapGql);
