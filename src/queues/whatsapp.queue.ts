import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const whatsappQueue = new Queue("whatsapp-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});