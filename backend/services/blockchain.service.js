import { ethers } from "ethers";
import EscrowArtifact from "../../escrow_contract/artifacts/contracts/Escrow.sol/Escrow.json" with { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

export const deployEscrow = async (buyer, seller, milestones) => {
  const factory = new ethers.ContractFactory(
    EscrowArtifact.abi,
    EscrowArtifact.bytecode,
    wallet,
  );

  const escrow = await factory.deploy(buyer, seller, milestones);

  await escrow.waitForDeployment();

  const contractAddress = await escrow.getAddress();

  return { contractAddress };
};

export const fundMilestoneTx = async (
  contractAddress,
  milestoneIndex,
  amount,
) => {
  const escrow = new ethers.Contract(
    contractAddress,
    EscrowArtifact.abi,
    wallet,
  );

  const tx = await escrow.fundMilestone(milestoneIndex, {
    value: ethers.parseEther(amount.toString()),
  });

  await tx.wait();

  return tx.hash;
};
