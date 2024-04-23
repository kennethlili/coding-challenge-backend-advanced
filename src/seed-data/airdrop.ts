import { AirdropJob, IAirdropJob } from "../models/airdrop-job";

export async function airdropJobSeedData(airdropJob?: Partial<IAirdropJob>) {
  return await AirdropJob.create({
    redeemCode: "AB1234",
    quantity: 3,
    recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
    contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
    ...airdropJob
  });
}
