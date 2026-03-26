import { WhatsAppTemplateData } from "../sender";

export interface RewardTemplateInput {
  to: string;
  name: string;
  points: number;
  imageUrl: string;
}

export function buildRewardTemplate({
  to,
  name,
  points,
  imageUrl,
}: RewardTemplateInput): WhatsAppTemplateData {
  return {
    to,
    template: "reward_notification",
    language: "en",

    header: [
      {
        type: "image",
        link: imageUrl,
      },
    ],

    body: [
      {
        type: "text",
        value: name,
      },
      {
        type: "text",
        value: points,
      },
    ],
  };
}