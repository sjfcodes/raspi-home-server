import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";

export const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

export const server = createServer(app);
