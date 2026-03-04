import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const buyerWallet = new ethers.Wallet(
  process.env.BUYER_PRIVATE_KEY,
  provider,
);
