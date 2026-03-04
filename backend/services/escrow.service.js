import { deployEscrow } from "./blockchain.service.js";
import { insertEscrowWithMilestones } from "../repositories/escrow.repository.js";

export const createEscrow = async ({ buyer, seller, milestones }) => {
  const { contractAddress } = await deployEscrow(buyer, seller, milestones);

  const totalAmount = milestones
    .map(BigInt)
    .reduce((a, b) => a + b, 0n)
    .toString();

  const escrowId = await insertEscrowWithMilestones({
    contractAddress,
    buyer,
    seller,
    totalAmount,
    milestones,
  });

  return {
    success: true,
    escrowId,
    contractAddress,
  };
};
