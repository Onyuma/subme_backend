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
