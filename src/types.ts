import { z } from "zod";
import User from "./models/user.model";

export type RouteParams = {
  route: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  handler: any;
};

export const RouteParamsSchema = z.object({
  route: z.url(),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  handler: z.any(),
});

export const TransactionSchema = z.object({
  transaction_id: z.string(),
  network: z.string(),
  price: z.string(),
  category: z.string(),
  validity: z.string(),
  phone_number: z.string(),
});

export const LoginUserScheme = z.object({
  email: z.email(),
  password: z.string(),
});

export type TransactionType = z.infer<typeof TransactionSchema>;
type Use = z.infer<typeof RouteParamsSchema>;

export type Payload = {
  uid: string;
};

export namespace Squad {
  export type BuyAirtimePayload = { phone_number: string; amount: number };

  export type BuyAirtimeRawResponse = {
    status?: number;
    success: boolean;
    message: string;
    data: {
      reference: string;
      amount: string;
      merchant_amount: string;
      phone_number: string;
      email?: null | string;
      merchant_id: string;
      wallet_batch_id: string;
      value_reference: null | string;
      network: string;
      transaction_id: null | string;
      type: string;
      action: string;
      status: string;
      meta: string;
      meta_json: {};
      createdAt: string;
      updatedAt: string;
    };
  };

  export type BuyAirtimeResponse = {
    reference: string;
    amount: string;
    phoneNumber: string;
    network: string;
    type: string;
    action: string;
    createdAt: string;
    updatedAt: string;
  };

  type DataPlanRawResponse = {
    plan_name: string;
    bundle_value: string;
    bundle_validity: string;
    bundle_description: string;
    bundle_price: string;
    plan_code: string;
    network: string;
  };

  export type RetrieveDataPlanRawResponse = {
    status?: number;
    success: boolean;
    message: string;
    data: DataPlanRawResponse[];
  };

  export type RetrieveDataPlanResponse = {
    planName: string;
    bundleValue: string;
    bundleValidity: string;
    bundleDescription: string;
    bundlePrice: string;
    planCode: string;
    network: string;
  };
}
export namespace DataReloaded {
  export type DataPlanResponse = {
    _id: string;
    id: number;
    dataplan_id: string;
    plan_network: string;
    plan_type: string;
    month_validate: string;
    plan: string;
    my_price: string;
    resellerPrice: string;
    apiPrice: string;
    __v: number;
    isAvailable: boolean;
    network: number;
    plan_amount: string;
    planCategory: string;
    supplierPlanIds: {};
    planSupplierMode: string;
    supplierCostPrices: {};
    price: number;
  };
}
export namespace Paystack {
  export type InitializeTransactionArgs = {
    email: string;
    amount: number;
    callback_url?: string;
    metadata?: {
      name: string;
      email: string;
      amount: number;
    };
  };

  export type InitializeTransactionRawResponse = {
    status: boolean;
    message: string;
    data: {
      reference: string;
      authorization_url: string;
      access_code: string;
    };
  };

  export type InitializeTransactionResponse = {
    reference: string;
    authorizationUrl: string;
    accessCode: string;
  };

  export type VerifyTransactionRawResponse = {
    status: boolean;
    message: string;
    data: {
      reference: string;
      amount: number;
      status: string;
      metadata: {
        name: string;
        email: string;
        amount: number;
      };
    };
  };
}
