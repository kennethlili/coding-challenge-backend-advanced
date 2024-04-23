import request from "supertest";
import express from "express";
import airdropController from "./airdrop.controller";
import loginController from "./login.controller";
import { IAirdropJob } from "../models/airdrop-job";
import { airdropJobSeedData } from "../seed-data/airdrop";

// a file to test the controller log and permission

const app = express();
app.use(express.json());
app.use("/airdrops", airdropController);
app.use("", loginController);

describe("rbca controller", () => {
  let userToken: string;
  let adminToken: string;
  let createdAirdropJob: IAirdropJob;

  beforeEach(async () => {
    const userRes = await request(app)
      .post("/login")
      .send({ username: "user", password: "user" });
    userToken = userRes.body.token;

    const adminRes = await request(app)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    adminToken = adminRes.body.token;

    // seed data for airdrop jobs
    createdAirdropJob = await airdropJobSeedData();
  });

  it("should allow admin to create airdrop job", async () => {
    const res = await request(app)
      .post("/airdrops/generate-redeem-code")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        redeemCode: "AA1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should allow user to create airdrop job", async () => {
    const res = await request(app)
      .post("/airdrops/generate-redeem-code")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        redeemCode: "AA1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should allow admin to redeem airdrop job", async () => {
    const res = await request(app)
      .post("/airdrops/redeem")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        redeemCode: "AB1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should allow user to redeem airdrop job", async () => {
    const res = await request(app)
      .post("/airdrops/redeem")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        redeemCode: "AB1234",
        quantity: 1,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should allow admin to GET airdrop jobs", async () => {
    const res = await request(app)
      .get("/airdrops")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should reject user to GET airdrop jobs", async () => {
    const res = await request(app)
      .get("/airdrops")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("errorMessage");
    expect(res.body.success).toBeFalsy();
  });

  it("should allow admin to GET airdrop job", async () => {
    const res = await request(app)
      .get("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should reject user to GET airdrop job", async () => {
    const res = await request(app)
      .get("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("errorMessage");
    expect(res.body.success).toBeFalsy();
  });

  it("should allow admin to UPDATE airdrop job", async () => {
    const res = await request(app)
      .put("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        redeemed: true,
        quantity: 3,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.success).toBeTruthy();
  });

  it("should reject user to UPDATE airdrop job", async () => {
    const res = await request(app)
      .put("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        redeemed: true,
        quantity: 3,
        recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
        contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
      });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("errorMessage");
    expect(res.body.success).toBeFalsy();
  });

  it("should allow admin to DELETE airdrop job", async () => {
    const res = await request(app)
      .delete("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  it("should reject user to DELETE airdrop job", async () => {
    const res = await request(app)
      .delete("/airdrops/" + createdAirdropJob.redeemCode)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("errorMessage");
    expect(res.body.success).toBeFalsy();
  });
});
