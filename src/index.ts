import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-safe";
import inventoryRoutes from './ports/rest/routes/inventory';
import { ConnectToDb } from './infrastructure/mongodb/connection';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config({
  allowEmptyValues: true,
  path: `.env.${process.env.NODE_ENV || 'local'}`,
  example: '.env.example'
});

const port = process.env.PORT || 3001;
ConnectToDb();
app.use("/healthcheck", (req, res) => {
  res.status(200).send("The Inventory Service is ALIVE!");
});

app.use("/inventory", inventoryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});