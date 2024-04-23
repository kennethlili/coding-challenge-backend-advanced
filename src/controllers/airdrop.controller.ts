import express from "express";
const router = express.Router();
import { AirdropService } from "../services/airdrop.service";
import { Request, Response } from 'express';
import { ApiReponseData } from "../models/api";
import { AirdropJobStore } from "../models/airdropJob";
import { CreateAirdropJobDto, AirdropJob, createAirdropJobDto, RedeemNftDto, redeemNftDto, UpdateAirdropJobDto, updateAirdropJobDto } from "../models/dto";

const airdropJonStore = new AirdropJobStore();

const airdropService = new AirdropService(airdropJonStore)

router.post("/generate-redeem-code", (req: Request<{}, {}, CreateAirdropJobDto>, res: Response<ApiReponseData<AirdropJob>>) => {
  try {
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

router.post("/redeem", (req: Request<{}, {}, RedeemNftDto>, res: Response<ApiReponseData<AirdropJob>>) => {
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

//admin request
router.get("/", (req: Request<{}, {}, {}>, res: Response<ApiReponseData<AirdropJob[]>>) => {
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

router.get("/:redeemCode", (req: Request<{ redeemCode: string }, {}, {}>, res: Response<ApiReponseData<AirdropJob>>) => {
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


router.put("/:redeemCode", (req: Request<{ redeemCode: string }, {}, UpdateAirdropJobDto>, res: Response<ApiReponseData<AirdropJob>>) => {
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

router.delete("/:redeemCode", (req: Request<{ redeemCode: string }, {}, {}>, res: Response<ApiReponseData<undefined>>) => {
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