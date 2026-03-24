import dotenv from "dotenv";

dotenv.config();

import "./workers/whatsapp.worker";

console.log(process.env.WHATSAPP_PHONE_NUMBER_ID, "env")
console.log("Workers started...");