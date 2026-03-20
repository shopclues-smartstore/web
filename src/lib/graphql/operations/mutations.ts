import { gql } from "@apollo/client";

import createWorkspaceGql from "./mutations/create-workspace.gql?raw";
import createWorkspaceSubscriptionGql from "./mutations/create-workspace-subscription.gql?raw";
import syncAmazonListingsGql from "./mutations/sync-amazon-listings.gql?raw";
import syncAmazonOrdersGql from "./mutations/sync-amazon-orders.gql?raw";
import getOrderDocumentGql from "./mutations/get-order-document.gql?raw";

export const CREATE_WORKSPACE = gql(createWorkspaceGql);
export const CREATE_WORKSPACE_SUBSCRIPTION = gql(createWorkspaceSubscriptionGql);
export const SYNC_AMAZON_LISTINGS = gql(syncAmazonListingsGql);
export const SYNC_AMAZON_ORDERS = gql(syncAmazonOrdersGql);
export const GET_ORDER_DOCUMENT = gql(getOrderDocumentGql);
