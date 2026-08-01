import axios, { AxiosInstance } from "axios";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";
import { DataReloaded, Payflex, Squad } from "../types";
import { BadRequestError } from "../utils/ApiError";
import { convertObjectKeysToCamelCase } from "../utils/snaketocamelconverter";
import { StatusCodes } from "http-status-codes";

class PayflexApi {
  axiosInstance: AxiosInstance;
  baseUrl = configs.PAYFLEX_BASE_URL as string;

  constructor() {
    const key = configs.PAYFLEX_API_KEY as string | undefined;
    if (!key) {
      throw new Error(
        "PAYFLEX_API_KEY is not defined in the environment variables"
      );
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${key}`,
      },
    });

    this.axiosInstance.defaults.headers.common["Authorization"] =
      `Token ${key}`;
    this.axiosInstance.defaults.headers.common["Content-Type"] =
      "application/json";

    if (process.env.NODE_ENV !== "production") {
      const masked =
        key.length > 8 ? `${key.slice(0, 4)}...${key.slice(-4)}` : key;

      console.log("[PayflexApi] PAYFLEX_API_KEY=", masked);
    }
  }

  buyAirtime = async (payload: Payflex.BuyAirtimePayload) => {
    try {
      const urlObj = new URL("/api/airtime/topup/", this.baseUrl);

      const response = await fetch(urlObj.toString(), {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
        },
      });
      if (!response.ok) {
        const message = await response.json();
        throw new BadRequestError(message.message || "Something went wrong");
      }
      if (response.status === StatusCodes.NO_CONTENT) {
        return;
      }
      const data = (await response.json()) as Payflex.BuyAirtimeRawResponse;
      return convertObjectKeysToCamelCase<Payflex.BuyAirtimeResponse>(data);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }

    // const response =
    //   await this.axiosInstance.post<Payflex.BuyAirtimeRawResponse>(
    //     "/api/airtime/topup/",
    //     payload
    //   );
    // return convertObjectKeysToCamelCase<Payflex.BuyAirtimeResponse>(
    //   response.data
    // );
  };

  retrieveNetworkLists = async () => {
    const response =
      await this.axiosInstance.get<Payflex.RetrieveNetworkListRawResponse>(
        "/api/data/networks/"
      );

    if (response.status != 200) {
      throw new BadRequestError("Something went wrong");
    }

    return response.data.networks;
  };

  retrieveDataPlan = async (planId: string) => {
    try {
      const urlObj = new URL(
        `/api/data/plans/?network=${planId}`,
        this.baseUrl
      );

      const response = await fetch(urlObj.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
        },
      });
      if (!response.ok) {
        const message = await response.json();
        throw new BadRequestError(message.message || "Something went wrong");
      }
      if (response.status === StatusCodes.NO_CONTENT) {
        return;
      }
      const data = (await response.json()) as Payflex.RetrieveDataPlanResponse;
      return data.plans.map((plan) =>
        convertObjectKeysToCamelCase<Payflex.DataPlan>({
          ...plan,
          label: plan.label.replace(/=\s*[A-Za-z₦$]?\d+\s*/g, "").trim(),
        })
      );
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  };

  buyData = async (payload: Payflex.BuyDataPayload) => {
    try {
      const urlObj = new URL("/api/data/purchase/", this.baseUrl);

      const response = await fetch(urlObj.toString(), {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
        },
      });
      if (!response.ok) {
        const message = await response.json();
        throw new BadRequestError(message.message || "Something went wrong");
      }
      if (response.status === StatusCodes.NO_CONTENT) {
        return;
      }
      const data = (await response.json()) as Payflex.BuyDataRawResponse;
      return convertObjectKeysToCamelCase<Payflex.BuyDataResponse>(data);
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  };

  cableProviders = async () => {
    const response =
      await this.axiosInstance.get<Payflex.CableProviderResponse>(
        "/api/cable/providers"
      );
    if (response.status != 200) {
      throw new BadRequestError("Something went wrong");
    }
    return response.data.providers;
  };
}

const payflexApi = new PayflexApi();
export default payflexApi;
