import { Paystack } from "../types";
import BaseApi from "../utils/base.api";
import configs from "../utils/configs";
import { convertObjectKeysToCamelCase } from "../utils/snaketocamelconverter";

class PaystackApi extends BaseApi {
  private requestOption: RequestInit = {
    headers: {
      Authorization: `Bearer ${configs.PAYSTACK_TEST_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  constructor() {
    super(configs.PAYSTACK_BASE_URL as string);
  }

  initialize = async (body: Paystack.InitializeTransactionArgs) => {
    const response = await this.post<Paystack.InitializeTransactionRawResponse>(
      "/transaction/initialize",
      body,
      undefined,
      this.requestOption
    );
    return convertObjectKeysToCamelCase<Paystack.InitializeTransactionResponse>(
      response.data
    );
  };

  verify = async (reference: string) => {
    return this.get<Paystack.VerifyTransactionRawResponse>(
      `/transaction/verify/${reference}`,
      undefined,
      this.requestOption
    );
  };
}

const paystackApi = new PaystackApi();
export default paystackApi;
