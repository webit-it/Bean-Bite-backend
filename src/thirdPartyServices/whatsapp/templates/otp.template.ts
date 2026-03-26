import { WhatsAppTemplateData } from "../sender";

export interface OTPTemplateInput {
  to: string;
  otp: string;
}

export function buildOtpTemplate({
  to,
  otp,
}: OTPTemplateInput): WhatsAppTemplateData {
  return {
    to,
    template: "otp_verification",
    language: "en",
    body: [
      {
        type: "text",
        value: otp,
      },
    ],
  };
}