import { z } from "zod";

const addressString = z.string().length(42);

export const airdropJob = z.object({
  uuid: z.string().uuid(),
  redeemed: z.boolean(),
  redeemCode: z.string().length(6),
  quantity: z.number().positive().int(),
  recipient: addressString,
  contractAddress: addressString,
  redeemAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AirdropJob = z.infer<typeof airdropJob>;

export const createAirdropJobDto = z.object({
  redeemCode: z.string().length(6),
  quantity: z.number().positive().int(),
  recipient: addressString,
  contractAddress: addressString,
});

export type CreateAirdropJobDto = z.infer<typeof createAirdropJobDto>;

export const redeemNftDto = z.object({
  redeemCode: z.string().length(6),
  recipient: addressString,
});

export type RedeemNftDto = z.infer<typeof redeemNftDto>;

export const updateAirdropJobDto = z.object({
  redeemed: z.boolean(),
  quantity: z.number().positive().int(),
  recipient: addressString,
  contractAddress: addressString,
  redeemAt: z.date().optional(),
});

export type UpdateAirdropJobDto = z.infer<typeof updateAirdropJobDto>;
