import { AccountFragment, PayableAmountFragment, graphql } from "@lens-protocol/client";

export const TokenDistributedNotificationFragment = graphql(
  `
    fragment TokenDistributedNotification on TokenDistributedNotification {
      __typename
      id
      account {
        ...Account
      }
      amount {
        ...PayableAmount
      }
      actionDate
    }
  `,
  [AccountFragment, PayableAmountFragment],
);
