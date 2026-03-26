import { whatsappQueue } from "../queues/whatsapp.queue";

async function testRewardMessage() {
  await whatsappQueue.add(
    "whatsapp-queue",
    {
      type: "REWARD",
      payload: {
        to: "919567449325",
        name: "dEV",
        points: 150,
        imageUrl: "https://picsum.photos/500"
      }
    },
    {
      jobId: `reward-${Date.now()}` // unique job id
    }
  );

  console.log("Test reward job added");
}

testRewardMessage();