import bodyparser from "body-parser";
import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

export { server };
