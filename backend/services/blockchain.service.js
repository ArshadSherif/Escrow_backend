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
