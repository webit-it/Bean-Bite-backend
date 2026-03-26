import { whatsappQueue } from "./whatsapp.queue";

export type WhatsAppJobType = "OTP" | "REWARD";

interface OTPPayload {
  to: string;
  otp: string;
}

interface RewardPayload {
  to: string;
  name: string;
  points: number;
  imageUrl: string;
}

type WhatsAppPayloadMap = {
  OTP: OTPPayload;
  REWARD: RewardPayload;
};

export interface WhatsAppProcedureInput<T extends WhatsAppJobType> {
  type: T;
  payload: WhatsAppPayloadMap[T];
}

/**
 * Central procedure to queue WhatsApp messages
 */
export const whatsappProcedure = async <
  T extends WhatsAppJobType
>(
  data: WhatsAppProcedureInput<T>
): Promise<void> => {
  await whatsappQueue.add(
    "send-whatsapp",
    data,
    {
      attempts: 1,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    }
  );
};