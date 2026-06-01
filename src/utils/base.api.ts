import { URLSearchParams } from "url";
import { BadRequestError } from "./ApiError";
import { StatusCodes } from "http-status-codes";

class BaseApi {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  fetch = async (
    url: string,
    body?: BodyInit,
    args?: Record<string, any>,
    requestInit?: RequestInit
  ) => {
    try {
      const urlObj = new URL(url, this.baseUrl);
      if (args) {
        urlObj.search = new URLSearchParams(args).toString();
      }
      const requestOption = { ...requestInit, body };
      const response = await fetch(urlObj.toString(), requestOption);
      if (!response.ok) {
        const message = await response.text();
        throw new BadRequestError(message);
      }
      if (response.status === StatusCodes.NO_CONTENT) {
        return;
      }
      return response.json();
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  };

  get = async <T>(
    url: string,
    args?: Record<string, any>,
    requestInit?: RequestInit
  ): Promise<T> => {
    return this.fetch(url, undefined, args, { ...requestInit, method: "GET" });
  };

  post = async <T>(
    url: string,
    body?: Record<string, any>,
    args?: Record<string, any>,
    requestInit?: RequestInit
  ): Promise<T> => {
    const bodyString = body ? JSON.stringify(body) : undefined;
    return this.fetch(url, bodyString, args, {
      ...requestInit,
      method: "POST",
    });
  };
}

export default BaseApi;
