import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || "8888";

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
