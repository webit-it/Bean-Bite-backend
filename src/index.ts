import express from "express"
import http from "http"
import "dotenv/config";
import cookieParser from "cookie-parser"
import cors from "cors"
import logger from "./logger";
import connectDB from "./config/db";
import customerRouter from "./routes/customer.router"
import adminRouter from "./routes/admin.router"
import qrRouter from "./routes/qr.router"
import router from "./routes/customer.router";
import { multerErrorHandler } from "./middleware/multerErrorHandler";
import { initSocket } from "./config/socket";

const app=express()
connectDB()

const server=http.createServer(app)
initSocket(server);
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_ADMIN_URL
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use("/api/customer",customerRouter)
app.use("/api/admin",adminRouter)
app.use("/api/qr",qrRouter)
app.use("/api", router); 
app.use(multerErrorHandler); 

const PORT = process.env.PORT||3001 ;

server.listen(PORT,()=>{
    logger.info(`Server started on port ${PORT}`)
})