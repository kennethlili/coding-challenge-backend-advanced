import { v4 as uuidv4 } from "uuid";
import { AirdropJob, CreateAirdropJobDto, UpdateAirdropJobDto } from "./dto";

export class AirdropJobStore {
  private data: AirdropJob[] = [];

  isRedeemCodeExist(redeemCode: string): boolean {
    return this.data.some((job) => job.redeemCode === redeemCode);
  }

  // Create a new AirdropJob
  create(airdropJob: CreateAirdropJobDto): AirdropJob {
    const _airdropJob: AirdropJob = {
      ...airdropJob,
      redeemed: false,
      uuid: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (this.isRedeemCodeExist(_airdropJob.redeemCode)) {
      throw new Error("Redeem code already exist");
    }
    this.data.push(_airdropJob);
    return _airdropJob;
  }

  // Retrieve all AirdropJobs
  findAll(): AirdropJob[] {
    return this.data;
  }
  // Retrieve a specific AirdropJob by redeemCode
  findByRedeemCodeOrFail(redeemCode: string): AirdropJob {
    const result = this.data.find((job) => job.redeemCode === redeemCode);
    if (result === undefined) {
      throw new Error("Airdrop job not found");
    }
    return result;
  }

  // Update an existing AirdropJob
  update(redeemCode: string, updatedJob: UpdateAirdropJobDto): AirdropJob {
    const index = this.data.findIndex((job) => job.redeemCode === redeemCode);
    if (index !== -1) {
      const _airdropJob = {
        ...this.data[index],
        ...updatedJob,
        updatedAt: new Date(),
      };
      this.data[index] = _airdropJob;
      return _airdropJob;
    }
    throw new Error("Airdrop job not found");
  }

  // Delete an AirdropJob
  delete(redeemCode: string): boolean {
    const index = this.data.findIndex((job) => job.redeemCode === redeemCode);
    if (index !== -1) {
      this.data=this.data.splice(index, 1);
      return true;
    }
    return false;
  }
}
