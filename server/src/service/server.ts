import bodyparser from "body-parser";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const server = createServer({});

export { app, server };
