import express, { NextFunction } from "express";
const router = express.Router();
import { AirdropService } from "../services/airdrop.service";
import { Response } from 'express';
import { ApiReponseData } from "../models/api";
import { AirdropJobStore } from "../models/airdropJob";
import { CreateAirdropJobDto, AirdropJob, createAirdropJobDto, RedeemNftDto, redeemNftDto, UpdateAirdropJobDto, updateAirdropJobDto } from "../models/dto";
import { expressjwt, Request } from "express-jwt";
import { JwtItem, Role } from "./login.controller";

const airdropJonStore = new AirdropJobStore();

const airdropService = new AirdropService(airdropJonStore);

function permissionCheck() {
  return (req: Request<JwtItem>, res: Response, next: NextFunction) => {
    const jwtItem: JwtItem = req.auth as JwtItem;
    const { role } = jwtItem;
    if (req.path === '/generate-redeem-code' || req.path === '/redeem') {
      //allow all role
      return next();
    }
    if (role !== Role.Admin) {
      return res.status(403).json({ success: false, errorMessage: 'Permission denied' });
    }
    next();
  }
}

router.post("/generate-redeem-code",expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
,permissionCheck(),  (req: Request<JwtItem>, res: Response<ApiReponseData<AirdropJob>>) => {
  try {
    // permissionCheck(req.path, req.auth);
    const body = req.body;
    createAirdropJobDto.parse(body);
    const result = airdropService.createAirdropJob(body);
    res.json({ success: true, data: result });
  } catch (error) {
    let errorMessage = 'Unknown Error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, errorMessage: errorMessage });
  }
});

router.post("/redeem",expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
,permissionCheck(),  (req: Request<JwtItem>, res: Response<ApiReponseData<AirdropJob>>) => {
  try {
    const body = req.body;
    redeemNftDto.parse(body);
    const result = airdropService.redeemNft(body);
    res.json({ success: true, data: result });
  } catch (error) {
    let errorMessage = 'Unknown Error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, errorMessage: errorMessage });
  }
});

// admin request
// should provide the secret in env, but as this project is for demo purpose, I will hardcode it here
router.get("/",
  expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
  ,permissionCheck(), 
  (req: Request<JwtItem>, res: Response<ApiReponseData<AirdropJob[]>>) => {
    try {
      const result = airdropService.getAirdropJobs();
      res.json({ success: true, data: result });
    } catch (error) {
      let errorMessage = 'Unknown Error'
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ success: false, errorMessage: errorMessage });
    }
  });

router.get("/:redeemCode", expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
,permissionCheck(), (req: Request<JwtItem>, res: Response<ApiReponseData<AirdropJob>>) => {
  try {
    const redeemCode = req.params.redeemCode;
    const result = airdropService.getAirdropJobByRedeemCode(redeemCode);
    res.json({ success: true, data: result });
  } catch (error) {
    let errorMessage = 'Unknown Error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, errorMessage: errorMessage });
  }
});


router.put("/:redeemCode", expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
,permissionCheck(), (req: Request<JwtItem>, res: Response<ApiReponseData<AirdropJob>>) => {
  try {
    const redeemCode = req.params.redeemCode;
    updateAirdropJobDto.parse(req.body);
    const result = airdropService.updateAirdropJob(redeemCode, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    let errorMessage = 'Unknown Error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, errorMessage: errorMessage });
  }
});

router.delete("/:redeemCode",expressjwt({ secret: 'dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc', algorithms: ["HS256"] })
,permissionCheck(),  (req: Request<JwtItem>, res: Response<ApiReponseData<undefined>>) => {
  try {
    const redeemCode = req.params.redeemCode;
    const result = airdropService.deleteAirdropJob(redeemCode);
    res.json({ success: true });
  } catch (error) {
    let errorMessage = 'Unknown Error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, errorMessage: errorMessage });
  }
});



export default router;