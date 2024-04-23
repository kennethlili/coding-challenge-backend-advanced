import { AirdropService } from "./airdrop.service";
import { AirdropJobStore } from "../models/airdropJob";
import { AirdropJob, CreateAirdropJobDto, RedeemNftDto } from "../models/dto";

describe("AirdropService", () => {
  let airdropService: AirdropService;
  let airdropJobStore: AirdropJobStore;

  beforeEach(() => {
    airdropJobStore = new AirdropJobStore();
    airdropService = new AirdropService(airdropJobStore);
  });


  describe("redeemNft", () => {
    let createdAirdropJob: AirdropJob;

    beforeEach(() => {
      const createAirdropJobDto: CreateAirdropJobDto = {
        redeemCode: "AB1234",
        quantity: 2,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      };
      createdAirdropJob = airdropService.createAirdropJob(createAirdropJobDto);
    });
    it("should able to redeem the nft", () => {
      const redeemNftDto: RedeemNftDto = {
        redeemCode: createdAirdropJob.redeemCode,
        recipient: createdAirdropJob.recipient,
      };
      const result = airdropService.redeemNft(redeemNftDto);
      expect(result.redeemed).toBe(true);

      expect(() => airdropService.redeemNft(redeemNftDto)).toThrow();
      expect(() => airdropService.redeemNft({...redeemNftDto,recipient: 'wrong recipient'})).toThrow();

    });
  });

  describe("deleteAirdropJob", () => {
    it("should reject a delete an airdrop job", () => {
      const redeemCode = "example-redeem-code";
      expect(() => airdropService.deleteAirdropJob(redeemCode)).toThrow();
    });
  });
});
