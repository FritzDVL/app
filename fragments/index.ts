/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TokenDistributedNotificationFragment } from "@/fragments/notifications";
import type { FragmentOf } from "@lens-protocol/client";

declare module "@lens-protocol/client" {
  export interface TokenDistributedNotification extends FragmentOf<typeof TokenDistributedNotificationFragment> {}
}

export const fragments = [TokenDistributedNotificationFragment];
