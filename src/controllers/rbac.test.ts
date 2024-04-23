import request from "supertest";
import express from "express";
import airdropController from "./airdrop.controller";
import loginController from "./login.controller";

// a file to test the controller log and permission

const app = express();
app.use(express.json());
app.use("/airdrops", airdropController);
app.use("", loginController);

describe("rbca controller", () => {
  let userToken: string;
  let adminToken: string;
  beforeEach(async () => {
    const userRes = await request(app)
      .post("/login")
      .send({ username: "user", password: "user" });
    userToken = userRes.body.token;

    const adminRes = await request(app)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    adminToken = adminRes.body.token;
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
        redeemCode: "BB1234",
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
    console.log(res.body);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("errorMessage");
    expect(res.body.success).toBeFalsy();
  });
});
