import Queue from "bull";
import { ethers, getDefaultProvider } from "ethers";
import abi from "../abis/usdt.json";

interface AirdropQueue {
  redeemCode: string;
  recipient: string;
  quantity: number;
  contractAddress: string;
}

async function handleAirdrop(data: AirdropQueue) {
  const { redeemCode, recipient, quantity, contractAddress } = data;

  const providerUrl =
    "https://sepolia.infura.io/v3/60b4bfacec74473da813e4bff0ae237f";
  //replace this with actual contractAddress
  const address = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";

  // map the contract abi to the contract address in actual usecase by Record
  const contractABI = abi;

  const provider = getDefaultProvider("https://rpc.sepolia.org");

  const erc20 = new ethers.Contract(address, abi, provider);

  const decimals = await erc20.decimals();
  console.log({ decimals });
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
        username: "default",
        password: "p19sti7PPplkccSZvtWqWzhhcax26M8m",
      },
    });

    this.processJobs();
    handleAirdrop({
      redeemCode: "NV1234",
      quantity: 3,
      recipient: "0x166c3821785d6E7A15b18Ae32Afc49a6C7f3EF54",
      contractAddress: "0x4213560679F928541022f003338d73A4ee7A61F4",
    });
  }

  createJob(data: AirdropQueue) {
    return this.airdropQueue.add(data);
  }

  processJobs() {
    this.airdropQueue.process(async (job, done) => {
      try {
        const { redeemCode, recipient, quantity, contractAddress } = job.data;
        const result = await handleAirdrop(job.data);
        console.log('job done')
        job.moveToCompleted('done', true)
      } catch (error) {
        job.moveToFailed({ message: "job failed" });
      }
    });
  }
}
