// this file handle all business logic for airdrop
import { AirdropJobStore } from "../models/airdropJob";
import {
  AirdropJob,
  CreateAirdropJobDto,
  RedeemNftDto,
  UpdateAirdropJobDto,
} from "../models/dto";

export class AirdropService {
  constructor(private readonly airdropJobStore: AirdropJobStore) {}

  createAirdropJob(createAirdropJobDto: CreateAirdropJobDto): AirdropJob {
    const airdropJob = this.airdropJobStore.create(createAirdropJobDto);
    return airdropJob;
  }

  redeemNft(redeemNftDto: RedeemNftDto): AirdropJob {
    const { redeemCode, recipient } = redeemNftDto;
    const airdropJob = this.airdropJobStore.findByRedeemCodeOrFail(redeemCode);
    if (airdropJob.redeemed) {
      throw new Error("NFT already redeemed");
    }
    if (airdropJob.recipient !== recipient) {
      throw new Error("Invalid recipient");
    }
    airdropJob.redeemed = true;
    airdropJob.redeemAt = new Date();
    const result = this.airdropJobStore.update(
      airdropJob.redeemCode,
      airdropJob
    );

    return result;
  }

  getAirdropJobs(): AirdropJob[] {
    return this.airdropJobStore.findAll();
  }

  getAirdropJobByRedeemCode(redeemCode: string): AirdropJob {
    return this.airdropJobStore.findByRedeemCodeOrFail(redeemCode);
  }

  updateAirdropJob(
    redeemCode: string,
    updateAirdropJobDto: UpdateAirdropJobDto
  ): AirdropJob {
    return this.airdropJobStore.update(redeemCode, updateAirdropJobDto);
  }

  deleteAirdropJob(redeemCode: string): void {
    const result = this.airdropJobStore.delete(redeemCode);
    if (!result) {
      throw new Error("Airdrop job not found");
    }
  }
}
