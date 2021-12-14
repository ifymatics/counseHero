import express, { json } from "express";
import 'express-async-errors';
import { config } from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler";
import { organizationRoutes } from "./routes/organization";
import { counselorRoutes } from "./routes/counselor";
import { studentRoutes } from "./routes/student";
//import { eventRoutes } from "./routes/events";
config();


const app = express();
//internal middlewares
app.use(json());
app.use(cors());
//api Routes
app.use(organizationRoutes);
app.use(counselorRoutes);
app.use(studentRoutes)

app.use(errorHandler);
export { app };