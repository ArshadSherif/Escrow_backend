import { deployEscrow, fundMilestoneTx } from "./blockchain.service.js";
import {
  insertEscrowWithMilestones,
  getEscrowById,
  getMilestone,
  markMilestoneFunded,
} from "../repositories/escrow.repository.js";

import { ethers } from "ethers";

export const createEscrow = async ({ buyer, seller, milestones }) => {
  if (
    !buyer ||
    !seller ||
    !Array.isArray(milestones) ||
    milestones.length === 0
  ) {
    throw new Error("Invalid escrow payload");
  }

  const milestoneAmounts = milestones.map((m) =>
    ethers.parseEther(m.amount.toString()),
  );

  const { contractAddress } = await deployEscrow(
    buyer,
    seller,
    milestoneAmounts,
  );

  const totalAmount = milestoneAmounts
    .map((a) => BigInt(a))
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

export const fundMilestone = async ({ escrowId, milestoneIndex }) => {
  const escrow = await getEscrowById(escrowId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  const milestone = await getMilestone(escrowId, milestoneIndex);

  if (!milestone) {
    throw new Error("Milestone not found");
  }

  const contractAddress = escrow.contract_address;
  const amount = milestone.amount;

  const txHash = await fundMilestoneTx(contractAddress, milestoneIndex, amount);

  await markMilestoneFunded(escrowId, milestoneIndex);

  return {
    success: true,
    contractAddress,
    milestoneIndex,
    txHash,
  };
};
