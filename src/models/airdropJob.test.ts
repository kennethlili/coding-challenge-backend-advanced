import { AirdropJobStore } from "./airdropJob";
import {
  AirdropJob,
  CreateAirdropJobDto,
  RedeemNftDto,
  UpdateAirdropJobDto,
} from "./dto";

describe("AirdropService", () => {
  let airdropJobStore: AirdropJobStore;

  beforeEach(() => {
    airdropJobStore = new AirdropJobStore();
  });

  describe("createAirdropJob", () => {
    it("should create a new airdrop job", () => {
      // Arrange
      const createAirdropJobDto: CreateAirdropJobDto = {
        redeemCode: "AA1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      };

      // Act
      const result = airdropJobStore.create(createAirdropJobDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.redeemCode).toBe(createAirdropJobDto.redeemCode);
      expect(result.quantity).toBe(createAirdropJobDto.quantity);
      expect(result.recipient).toBe(createAirdropJobDto.recipient);
      expect(result.contractAddress).toBe(createAirdropJobDto.contractAddress);
    });

    it("should throw an error if redeem code already exists", () => {
      const createAirdropJobDto: CreateAirdropJobDto = {
        redeemCode: "AA1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      };

      airdropJobStore.create(createAirdropJobDto);

      expect(() => airdropJobStore.create(createAirdropJobDto)).toThrow();
    });
  });

  describe("createAirdropJob", () => {
    let createdAirdropJob: AirdropJob;
    beforeEach(() => {
      createdAirdropJob = airdropJobStore.create({
        redeemCode: "AA1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
      airdropJobStore.create({
        redeemCode: "AB1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
    });
    it("should get all airdrop jobs", () => {
      const result = airdropJobStore.findAll();
      expect(result.length).toEqual(2);
    });

    it("should get a specific airdrop job by redeem code", () => {
      const result = airdropJobStore.findByRedeemCodeOrFail("AA1234");
      expect(result.redeemCode).toEqual("AA1234");
    });

    it("should get a specific airdrop job by redeem code", () => {
      const result = airdropJobStore.findByRedeemCodeOrFail("AB1234");
      expect(result.redeemCode).toEqual("AB1234");
    });

    it("should throw an error if airdrop job not found", () => {
      expect(() => airdropJobStore.findByRedeemCodeOrFail("AC1234")).toThrow();
    });

    it("should update airdrop", () => {
      const updatedJob: UpdateAirdropJobDto = {
        ...createdAirdropJob,
        quantity: 10,
        redeemed: true,
      };
      const data = airdropJobStore.update("AA1234", updatedJob);
      expect(data.quantity).toEqual(10);
      expect(data.redeemed).toEqual(true);
    });

    it("should throw error if airdrop not exist", () => {
      const updatedJob: UpdateAirdropJobDto = {
        ...createdAirdropJob,
        quantity: 10,
        redeemed: true,
      };
      expect(() => airdropJobStore.update("XX1234", updatedJob)).toThrow();
    });

    it("should delete airdrop", () => {
      airdropJobStore.delete("AA1234");
      const data = airdropJobStore.findAll();
      expect(data.length).toBe(1);
    });

    it("should throw error if airdrop not exist", () => {
      expect(airdropJobStore.delete("AC1234")).toBeFalsy();
    });
  });
});
