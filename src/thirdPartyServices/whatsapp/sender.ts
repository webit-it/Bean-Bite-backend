import axios from "axios";

/* TYPES */

export type WhatsAppLanguageCode = string;

export type WhatsAppTemplateParam =
  | {
    type: "text";
    value: string | number;
  }
  | {
    type: "image";
    link: string;
  };

export interface WhatsAppTemplateData {
  template: string;
  language: WhatsAppLanguageCode;
  to: string;

  body?: WhatsAppTemplateParam[];
  header?: WhatsAppTemplateParam[];

  buttons?: Array<{
    index: number;
    subtype: "url" | "quick_reply";
    params: WhatsAppTemplateParam[];
  }>;
}

export interface WhatsAppSendOptions {
  payload: WhatsAppTemplateData;
}

/* ENV */

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || "v18.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

function assertEnv() {
  console.log(process.env.WHATSAPP_PHONE_NUMBER_ID, "env")
  if (!PHONE_NUMBER_ID) throw new Error("WHATSAPP_PHONE_NUMBER_ID missing");
  if (!TOKEN) throw new Error("WHATSAPP_TOKEN missing");
}

/* META PAYLOAD BUILDER */

function toMetaTemplatePayload(payload: WhatsAppTemplateData) {
  const components: any[] = [];

  if (payload.header?.length) {
    components.push({
      type: "header",
      parameters: payload.header.map((h) => {
        if (h.type === "image") {
          return {
            type: "image",
            image: { link: h.link },
          };
        }

        return {
          type: "text",
          text: String(h.value),
        };
      }),
    });
  }

  if (payload.body?.length) {
    components.push({
      type: "body",
      parameters: payload.body
        .filter((p) => p.type === "text")
        .map((p) => ({
          type: "text",
          text: String(p.value),
        })),
    });
  }

  if (payload.buttons?.length) {
    for (const btn of payload.buttons) {
      components.push({
        type: "button",
        sub_type: btn.subtype,
        index: String(btn.index),
        parameters: (btn.params ?? [])
          .filter((pp) => pp.type === "text")
          .map((pp) => ({
            type: "text",
            text: String(pp.value),
          })),
      });
    }
  }

  return {
    messaging_product: "whatsapp",
    to: payload.to,
    type: "template",
    template: {
      name: payload.template,
      language: { code: payload.language },
      components,
    },
  };
}

/* SEND FUNCTION */

export async function sendTemplateViaMeta(
  options: WhatsAppSendOptions
): Promise<any> {
  assertEnv();

  const { payload } = options;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const data = toMetaTemplatePayload(payload);

  console.log("📦 WhatsApp payload:");
  console.log(JSON.stringify(data, null, 2));

  console.log("📡 Sending request to Meta API...");
  console.log("Endpoint:", url);

  try {
    const res = await axios.post(url, data, {
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const messageId = res.data?.messages?.[0]?.id;

    console.log("✅ WhatsApp message sent successfully");
    console.log({
      phone: payload.to,
      template: payload.template,
      messageId,
    });

    return res.data;
  } catch (err: any) {
    console.error("❌ WhatsApp API Error");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error:", err.message);
    }

    throw err;
  }
}