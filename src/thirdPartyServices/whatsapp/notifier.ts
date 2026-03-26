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
        name: payload.name,
        points: payload.points,
        imageUrl: payload.imageUrl,
      });

      return sendTemplateViaMeta({ payload: templatePayload });
    }

    default:
      throw new Error(`Unknown WhatsApp notification type: ${type}`);
  }
}