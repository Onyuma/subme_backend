import { RequestHandler } from "express";

export type RouteParams = {
  route: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  handler: any;
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
