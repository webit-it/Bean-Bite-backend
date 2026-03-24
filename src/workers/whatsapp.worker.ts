import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { handleWhatsAppNotification } from "../thirdPartyServices/whatsapp/notifier";

export const whatsappWorker = new Worker(
  "whatsapp-queue",
  async (job) => {
    console.log("🚀 Processing WhatsApp job");
    console.log("Job ID:", job.id);
    console.log("Job Data:", job.data);

    return handleWhatsAppNotification(job);
  },
  {
    connection: redisConnection,
  }
);

whatsappWorker.on("active", (job) => {
  console.log(`⚙️ Job ${job.id} started`);
});

whatsappWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

whatsappWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(err);
});

whatsappWorker.on("error", (err) => {
  console.error("🔥 Worker error:", err);
});