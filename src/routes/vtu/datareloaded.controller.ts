import { Request, Response } from "express";
import asyncWrapper from "../../utils/asyncwrapper";
import datareloadedApi from "../../services/datareloaded.api";
import { StatusCodes } from "http-status-codes";

class DatareloadedController {
  getDataPlan = asyncWrapper(async (req: Request, resp: Response) => {
    const { category, network } = req.query;
    console.log(category, network);
    let requestArgs: Record<string, string> | undefined = undefined;
    if (category || network) {
      requestArgs = { category: String(category), network: String(network) };
    }
    console.log(requestArgs);
    const response = await datareloadedApi.fetchDataPlan(requestArgs);

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Data plan retrieved successfully",
      data: response
        .filter((data) => data.isAvailable == true)
        .map((data) => {
          return {
            _id: data._id,
            price: data.my_price,
            planId: data.dataplan_id,
            networkId: data.plan_network,
            planCategory: data.planCategory,
            validity: data.month_validate,
            plan: data.plan,
            network: data.network,
          };
        }),
    });
  });
}

const datareloadedController = new DatareloadedController();
export default datareloadedController;
