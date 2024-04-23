import express, { Express, NextFunction, Request, Response } from "express";
import airdropController from "./controllers/airdrop.controller";
import bodyParser from "body-parser";
import loginController, { JwtItem } from "./controllers/login.controller";
import { db } from "./db.config";

const app: Express = express();
const port = process.env.PORT || "8888";

app.use(bodyParser.json());

function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errorMessage = "Internal Server Error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  res.setHeader("Content-Type", "application/json");

  res.status(500).json({ success: false, errorMessage: errorMessage });
}

app.use("/airdrops", airdropController);
app.use("", loginController);

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.use(errorHandler);

db.then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
