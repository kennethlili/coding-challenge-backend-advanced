import express, { NextFunction } from "express";
const router = express.Router();
import { AirdropService } from "../services/airdrop.service";
import { Response } from "express";
import { ApiReponseData } from "../models/api";
import {
  CreateAirdropJobDto,
  RedeemNftDto,
  UpdateAirdropJobDto,
  createAirdropJobDto,
  redeemNftDto,
  updateAirdropJobDto,
} from "../models/dto";
import { expressjwt, Request } from "express-jwt";
import { JwtItem, Role } from "./login.controller";
import { IAirdropJob } from "../models/airdrop-job";
import { AirdropQueueService } from "../services/airdrop-queue.service";

const airdropQueueService = new AirdropQueueService();
const airdropService = new AirdropService(airdropQueueService);

function permissionCheck() {
  return (req: Request<JwtItem>, res: Response, next: NextFunction) => {
    const jwtItem: JwtItem = req.auth as JwtItem;
    const { role } = jwtItem;
    if (req.path === "/generate-redeem-code" || req.path === "/redeem") {
      //allow all role
      return next();
    }
    if (role !== Role.Admin) {
      return res
        .status(403)
        .json({ success: false, errorMessage: "Permission denied" });
    }
    next();
  };
}

router.post(
  "/generate-redeem-code",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<IAirdropJob>>,
    next: NextFunction
  ) => {
    try {
      const body = req.body as CreateAirdropJobDto;
      createAirdropJobDto.parse(body);
      const result = await airdropService.createAirdropJob(body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/redeem",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<IAirdropJob>>,
    next: NextFunction
  ) => {
    try {
      const body = req.body as RedeemNftDto;
      redeemNftDto.parse(body);
      const result = await airdropService.redeemNft(body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

// admin request
// should provide the secret in env, but as this project is for demo purpose, I will hardcode it here
router.get(
  "/",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<IAirdropJob[]>>,
    next: NextFunction
  ) => {
    try {
      const result = await airdropService.getAirdropJobs();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:redeemCode",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<IAirdropJob>>,
    next: NextFunction
  ) => {
    try {
      const redeemCode = req.params.redeemCode;
      const result = await airdropService.getAirdropJobByRedeemCode(redeemCode);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:redeemCode",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<IAirdropJob>>,
    next: NextFunction
  ) => {
    try {
      const redeemCode = req.params.redeemCode;
      const body = req.body as UpdateAirdropJobDto;

      updateAirdropJobDto.parse(body);
      const result = await airdropService.updateAirdropJob(redeemCode, body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:redeemCode",
  expressjwt({
    secret:
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc",
    algorithms: ["HS256"],
  }),
  permissionCheck(),
  async (
    req: Request<JwtItem>,
    res: Response<ApiReponseData<undefined>>,
    next: NextFunction
  ) => {
    try {
      const redeemCode = req.params.redeemCode;
      const result = await airdropService.deleteAirdropJob(redeemCode);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
