import axios, { Axios, AxiosHeaders, AxiosInstance } from "axios";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";
import { url } from "node:inspector";
import { DataReloaded, Squad } from "../types";
import { BadRequestError } from "../utils/ApiError";
import { convertObjectKeysToCamelCase } from "../utils/snaketocamelconverter";

class SquadAPI {
  axiosInstance: AxiosInstance;
  baseUrl = configs.SQUAD_SANDBOX_BASE_URL as string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${configs.SQUAD_SANDBOX_API_SECRET_KEY}`,
      },
    });
  }

  buyAirtime = async (payload: Squad.BuyAirtimePayload) => {
    const response = await this.axiosInstance.post<Squad.BuyAirtimeRawResponse>(
      "/vending/purchase/airtime",
      payload
    );
    if (response.status != 200) {
      throw new BadRequestError("Something went wrong");
    }
    return convertObjectKeysToCamelCase<Squad.BuyAirtimeResponse>(
      response.data.data
    );
  };

  retrieveDataPlan = async (network?: string) => {
    const urlObj = new URL("/vending/data-bundles", this.baseUrl);
    if (network) {
      const query = { network };
      urlObj.search = new URLSearchParams(query).toString();
    }
    const url = `${urlObj.pathname}${urlObj.search}`;
    const response =
      await this.axiosInstance.get<Squad.RetrieveDataPlanRawResponse>(url);

    if (response.status != 200) {
      throw new BadRequestError("Something went wrong");
    }

    return response.data.data.map((plan) =>
      convertObjectKeysToCamelCase<Squad.RetrieveDataPlanResponse>(plan)
    );
  };
}

const squadApi = new SquadAPI();
export default squadApi;
