import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import express from "express";
const router = express.Router();

export enum Role {
  Public = "public",
  Admin = "admin",
}

export class User {
  id!: number;
  username!: string;
  password!: string;
  role!: Role;
}

const users: User[] = [
  { id: 1, username: "user", password: "user", role: Role.Public },
  { id: 2, username: "admin", password: "admin", role: Role.Admin },
];

export interface JwtItem {
  id: number;
  username: string;
  role: Role;
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const jwtItem: JwtItem = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    // should provide the secret in env, but as this project is for demo purpose, I will hardcode it here
    const token = jwt.sign(
      jwtItem,
      "dfffc72c84204af3147e2998255cb8082837b8fcc2d6969965afce1bfb91b39053256a7c78e4d7b0ad2290f4740467e4e0dae87bf8fca7421acd24acc7b42edc"
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

export default router;
