import axios from "axios";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";

class DatareloadedApi extends BaseApi {
  private requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configs.DATARELOADED_API_KEY}`,
    },
  };
  constructor() {
    super(configs.DATARELOADED_BASE_URL as string);
  }

  fetchDataPlan = async (args?: Record<string, string>) => {
    let requestArgs = undefined;
    if (args) {
      requestArgs = args;
    }
    return (
      await axios.get("/dataPlan", {
        ...this.requestOptions,
        baseURL: this.baseUrl,
        params: requestArgs,
      })
    ).data;
  };
}

const datareloadedApi = new DatareloadedApi();
export default datareloadedApi;
