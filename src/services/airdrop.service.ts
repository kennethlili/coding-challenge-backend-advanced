// this file handle all business logic for airdrop
import { FilterQuery } from "mongoose";
import { AirdropJob, IAirdropJob } from "../models/airdrop-job";
import {
  // AirdropJob,
  CreateAirdropJobDto,
  RedeemNftDto,
  UpdateAirdropJobDto,
} from "../models/dto";

async function findOneOrFail(
  conditions: FilterQuery<IAirdropJob>
): Promise<IAirdropJob> {
  const result = await AirdropJob.findOne(conditions);
  if (!result) {
    throw new Error("Airdrop job not found");
  }
  return result;
}

export class AirdropService {
  async createAirdropJob(
    createAirdropJobDto: CreateAirdropJobDto
  ): Promise<IAirdropJob> {
    const airdropJob = await AirdropJob.create(createAirdropJobDto);
    return airdropJob;
  }

  async redeemNft(redeemNftDto: RedeemNftDto): Promise<IAirdropJob> {
    const { redeemCode, recipient } = redeemNftDto;
    const airdropJob = await findOneOrFail({ redeemCode });
    if (airdropJob.redeemed) {
      throw new Error("NFT already redeemed");
    }
    if (airdropJob.recipient !== recipient) {
      throw new Error("Invalid recipient");
    }
    airdropJob.redeemed = true;
    airdropJob.redeemAt = new Date();
    const result = await airdropJob.save();

    return result;
  }

  async getAirdropJobs(): Promise<IAirdropJob[]> {
    return await AirdropJob.find();
  }

  async getAirdropJobByRedeemCode(redeemCode: string): Promise<IAirdropJob> {
    return await findOneOrFail({ redeemCode });
  }

  async updateAirdropJob(
    redeemCode: string,
    updateAirdropJobDto: UpdateAirdropJobDto
  ): Promise<IAirdropJob> {
    const result = await AirdropJob.findOneAndUpdate(
      { redeemCode },
      updateAirdropJobDto,
      { new: true }
    );
    if (!result) {
      throw new Error("Airdrop job not found");
    }
    return result;
  }

  async deleteAirdropJob(
    redeemCode: string
  ): Promise<{ deletedCount: number }> {
    const { deletedCount } = await AirdropJob.deleteOne({ redeemCode });
    return { deletedCount };
  }
}
