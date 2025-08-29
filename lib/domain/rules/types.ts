import { Address } from "@/types/common";
import { BigDecimal, TokenStandard } from "@lens-protocol/client";

export interface MembershipApprovalGroupRule {
  type: "MembershipApprovalGroupRule";
  membershipApprovalRule: { enable: true };
}

export interface SimplePaymentGroupRule {
  type: "SimplePaymentGroupRule";
  simplePaymentRule: {
    native: BigDecimal;
    recipient: Address;
  };
}

export interface TokenGatedGroupRule {
  type: "TokenGatedGroupRule";
  tokenGatedRule: {
    token: {
      currency: Address;
      standard: TokenStandard;
      value: string;
    };
  };
}
