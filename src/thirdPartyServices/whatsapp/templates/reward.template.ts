import { WhatsAppTemplateData } from "../sender";

export interface RewardTemplateInput {
  to: string;
  customerName: string;
  productName: string;
  rewardName: string;
  rewardLevel: string;
  actionUrl: string;
  productImageUrl: string;
}

export function buildRewardTemplate({
  to,
  customerName,
  productName,
  rewardName,
  rewardLevel,
  productImageUrl,
}: RewardTemplateInput): WhatsAppTemplateData {

  const baseUrl = process.env.CLIENT_URL;

  if (!baseUrl) {
    throw new Error("CLIENT_URL is not defined in .env");
  }

  // Construct dynamic URL in future 
  const actionUrl = `${baseUrl}`;

  return {
    to,
    template: "reward_notification",
    language: "en",

    header: [
      {
        type: "image",
        link: productImageUrl,
      },
    ],

    body: [
      { type: "text", value: customerName },
      { type: "text", value: productName },
      { type: "text", value: rewardName },
      { type: "text", value: rewardLevel },
    ],

    buttons: [
      {
        index: 0,
        subtype: "url",
        params: [
          {
            type: "text",
            value: actionUrl,
          },
        ],
      },
    ],
  }
}