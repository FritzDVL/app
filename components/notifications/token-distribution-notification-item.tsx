import { AvatarProfileLink } from "@/components/notifications/avatar-profile-link";
import { NotificationCard } from "@/components/notifications/notification-card";
import { getTimeAgo } from "@/lib/shared/utils";
import { Account, TokenDistributedNotification } from "@lens-protocol/client";
import { Coins } from "lucide-react";

interface TokenDistributionNotificationProps {
  notification: TokenDistributedNotification;
}

export function TokenDistributionNotificationItem({ notification }: TokenDistributionNotificationProps) {
  const amount = parseFloat(notification.amount.value);
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
  const recipient: Account = notification.account;
  const token = notification.amount.asset.symbol;
  const blockTimestamp = new Date(notification.actionDate as string);

  return (
    <NotificationCard href="/rewards">
      <div className="flex items-start gap-4">
        {/* Avatar of recipient (the user) */}
        <AvatarProfileLink author={recipient} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {/* Token icon accent */}
                <div className="rounded-full bg-yellow-100 p-1.5 dark:bg-yellow-900/30">
                  <Coins className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <div>
                <span className="mb-0.5 block text-xs font-medium text-muted-foreground">
                  {recipient?.metadata?.name || recipient?.username?.localName}
                </span>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 dark:text-gray-100">
                  You received {formattedAmount} {token}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(blockTimestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </NotificationCard>
  );
}
