import express, { Application } from "express";

const app: Application = express();
app.use(express.json());

// routes etc.

export default app;