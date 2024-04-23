import express, { Express, Request, Response } from "express";
import airdropController from './controllers/airdrop.controller';
import bodyParser from "body-parser";


const app: Express = express();
const port = process.env.PORT || "8888";

app.use(bodyParser.json());


app.use('/airdrops', airdropController);


app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
