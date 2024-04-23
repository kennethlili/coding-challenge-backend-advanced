import { AirdropService } from "./airdrop.service";
import { CreateAirdropJobDto, RedeemNftDto } from "../models/dto";
import { AirdropJob, IAirdropJob } from "../models/airdrop-job";
import { airdropJobSeedData } from "../seed-data/airdrop";
import { AirdropQueueService } from "./airdrop-queue.service";

describe("AirdropService", () => {
  let airdropService: AirdropService;

  beforeAll(async () => {
    const airdropQueueService = new AirdropQueueService();
    airdropService = new AirdropService(airdropQueueService);
  });

  describe("findOneOrFail", () => {
    beforeEach(async () => {
      await airdropJobSeedData();
    });

    it("should throw error if airdrop job not found", async () => {
      await expect(
        airdropService.getAirdropJobByRedeemCode("invalid-redeem-code")
      ).rejects.toThrow("Airdrop job not found");
    });

    it("should return airdrop job", async () => {
      const result = await airdropService.getAirdropJobByRedeemCode("AB1234");
      expect(result.redeemCode).toEqual("AB1234");
    });
  });

  describe("redeemNft", () => {
    let createdAirdropJob: IAirdropJob;

    beforeEach(async () => {
      createdAirdropJob = await airdropJobSeedData();
    });

    it("should redeem NFT", async () => {
      const redeemNftDto: RedeemNftDto = {
        redeemCode: createdAirdropJob.redeemCode,
        recipient: createdAirdropJob.recipient,
      };
      const result = await airdropService.redeemNft(redeemNftDto);
      expect(result.redeemed).toBe(true);
    });

    it("should throw error if recipient is invalid", async () => {
      const redeemNftDto: RedeemNftDto = {
        redeemCode: createdAirdropJob.redeemCode,
        recipient: createdAirdropJob.recipient,
      };
      await expect(
        airdropService.redeemNft({
          ...redeemNftDto,
          recipient: "wrong recipient",
        })
      ).rejects.toThrow("Invalid recipient");
    });
    it("should throw error if NFT already redeemed", async () => {
      const redeemNftDto: RedeemNftDto = {
        redeemCode: createdAirdropJob.redeemCode,
        recipient: createdAirdropJob.recipient,
      };
      await airdropService.redeemNft(redeemNftDto);
      await expect(airdropService.redeemNft(redeemNftDto)).rejects.toThrow(
        "NFT already redeemed"
      );
    });
  });

  describe("getAirdropJobs", () => {
    beforeEach(async () => {
      AirdropJob.create([
        {
          redeemCode: "AB1234",
          quantity: 2,
          recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
          contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
        },
        {
          redeemCode: "CD5678",
          quantity: 3,
          recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
          contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
        },
        {
          redeemCode: "NV5678",
          quantity: 3,
          recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
          contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
        },
      ]);
    });

    it("should return all airdrop jobs", async () => {
      const result = await airdropService.getAirdropJobs();
      expect(result.length).toEqual(3);
    });
  });

  describe("updateAirdropJob", () => {
    let createdAirdropJob: IAirdropJob;

    beforeEach(async () => {
      createdAirdropJob = await airdropJobSeedData();
    });

    it("should throw error if airdrop job not found", async () => {
      await expect(
        airdropService.updateAirdropJob("invalid-redeem-code", {
          redeemed: true,
          quantity: 3,
          recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
          contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
        })
      ).rejects.toThrow("Airdrop job not found");
    });

    it("should update airdrop job", async () => {
      const result = await airdropService.updateAirdropJob(
        createdAirdropJob.redeemCode,
        {
          redeemed: true,
          quantity: 3,
          recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
          contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
        }
      );
      expect(result.redeemed).toBe(true);
      expect(result.quantity).toBe(3);
    });
  });

  describe("deleteAirdropJob", () => {
    it("should return 0 for del a non-exist record", async () => {
      const redeemCode = "example-redeem-code";
      const result = await airdropService.deleteAirdropJob(redeemCode);
      expect(result.deletedCount).toEqual(0);
    });

    it("should return 1 for del a existing record", async () => {
      const redeemCode = "AB1234";
      await airdropService.createAirdropJob({
        redeemCode,
        quantity: 2,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
      const result = await airdropService.deleteAirdropJob(redeemCode);
      expect(result.deletedCount).toEqual(1);
    });
  });
});
