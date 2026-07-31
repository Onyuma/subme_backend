import axios, { Axios, AxiosHeaders, AxiosInstance } from "axios";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";
import { url } from "node:inspector";
import { DataReloaded, Payflex, Squad } from "../types";
import { BadRequestError } from "../utils/ApiError";
import { convertObjectKeysToCamelCase } from "../utils/snaketocamelconverter";

class PayflexApi {
  axiosInstance: AxiosInstance;
  baseUrl = configs.PAYFLEX_BASE_URL as string;

  private requestOption: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
      },
    });
  }

  buyAirtime = async (payload: Payflex.BuyAirtimePayload) => {
    const response =
      await this.axiosInstance.post<Payflex.BuyAirtimeRawResponse>(
        "/api/airtime/topup",
        payload,
        {
          headers: {
            Authorization: `Token ${configs.PAYFLEX_API_KEY}`,
          },
        }
      );

    return convertObjectKeysToCamelCase<Payflex.BuyAirtimeResponse>(
      response.data
    );
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
