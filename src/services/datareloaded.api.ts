import axios, { Axios, AxiosHeaders, AxiosInstance } from "axios";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";
import { url } from "node:inspector";
import { DataReloaded } from "../types";

class DatareloadedApi {
  axiosInstance: AxiosInstance;
  baseUrl = configs.DATARELOADED_BASE_URL as string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${configs.DATARELOADED_API_KEY}`,
      },
    });
  }

  fetchDataPlan = async (args?: Record<string, string>) => {
    let requestArgs = undefined;
    const urlObj = new URL("/dataPlan", this.baseUrl);

    if (args) {
      urlObj.search = new URLSearchParams(args).toString();
    }

    return (
      await this.axiosInstance.get<DataReloaded.DataPlanResponse[]>(
        `${urlObj.pathname}${urlObj.search}`
      )
    ).data;
    // return (
    //   await axios.get("/dataPlan", {
    //     ...this.requestOptions,
    //     baseURL: this.baseUrl,
    //     params: requestArgs,
    //   })
    // ).data;
  };
}

const datareloadedApi = new DatareloadedApi();
export default datareloadedApi;
