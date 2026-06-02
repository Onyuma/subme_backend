import { Request, Response } from "express";
import asyncWrapper from "../../utils/asyncwrapper";
import datareloadedApi from "../../services/datareloaded.api";
import { StatusCodes } from "http-status-codes";

class DatareloadedController {
  getDataPlan = asyncWrapper(async (req: Request, resp: Response) => {
    const { category, network } = req.query;
    console.log(category, network);
    let requestArgs;
    if (category || network) {
      requestArgs = JSON.stringify({
        category,
        network,
      });
    }
    const response = await datareloadedApi.fetchDataPlan();

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "Data plan retrieved successfully",
      data: [...(response as [])],
    });
  });
}

const datareloadedController = new DatareloadedController();
export default datareloadedController;
