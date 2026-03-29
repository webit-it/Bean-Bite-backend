import { Job } from "bullmq";
import { sendTemplateViaMeta } from "./sender";
import { buildOtpTemplate } from "./templates/otp.template";
import { buildRewardTemplate } from "./templates/reward.template";

export async function handleWhatsAppNotification(job: Job) {
  const { type, payload } = job.data;

  switch (type) {
    case "OTP": {
      const templatePayload = buildOtpTemplate({
        to: payload.to,
        otp: payload.otp,
      });

      return sendTemplateViaMeta({ payload: templatePayload });
    }

    case "REWARD": {
      const templatePayload = buildRewardTemplate({
        to: payload.to,
        customerName: payload.customerName,
        productName: payload.productName,
        rewardName: payload.rewardName,
        rewardLevel: payload.rewardLevel,
        actionUrl: payload.actionUrl,
        productImageUrl: payload.productImageUrl,
      });

      return sendTemplateViaMeta({ payload: templatePayload });
    }

    default:
      throw new Error(`Unknown WhatsApp notification type: ${type}`);
  }
}