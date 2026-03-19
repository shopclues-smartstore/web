import { gql } from '@apollo/client';

import adminUsersSampleGql from './queries/admin-users-sample.gql?raw';
import amazonListingsGql from './queries/amazon-listings.gql?raw';
import subscriptionPlansGql from './queries/subscription-plans.gql?raw';
import viewerBootstrapGql from './queries/viewer-bootstrap.gql?raw';

export const GET_ADMIN_USERS_SAMPLE = gql(adminUsersSampleGql);
export const AMAZON_LISTINGS = gql(amazonListingsGql);
export const SUBSCRIPTION_PLANS = gql(subscriptionPlansGql);
export const VIEWER_BOOTSTRAP = gql(viewerBootstrapGql);
