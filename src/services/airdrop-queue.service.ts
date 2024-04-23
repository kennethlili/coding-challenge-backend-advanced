import Queue from "bull";

interface AirdropQueue {
  redeemCode: string;
  recipient: string;
  quantity: number;
  contractAddress: string;
}

export class AirdropQueueService {
  private airdropQueue: Queue.Queue<AirdropQueue>;
  constructor() {
    this.airdropQueue = new Queue("airdrop", {
      redis: {
        // should wrap config in env, but this project is relatively small and the redis didnt contain secure data
        // so I put it here
        port: 15459,
        host: "redis-15459.c17.us-east-1-4.ec2.redns.redis-cloud.com",
        username:'default',
        password: "p19sti7PPplkccSZvtWqWzhhcax26M8m",
      },
    });

    this.processJobs();
  }

  createJob(data: AirdropQueue) {
    return this.airdropQueue.add(data);
  }

  processJobs() {
    this.airdropQueue.process(async (job, done) => {
      const { redeemCode, recipient, quantity, contractAddress } = job.data;
      console.log({ redeemCode, recipient, quantity, contractAddress });
      // Process the airdrop...
      done();
    });
  }
}
