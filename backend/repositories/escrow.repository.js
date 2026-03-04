import { pool } from "../config/db.js";

export const insertEscrowWithMilestones = async ({
  contractAddress,
  buyer,
  seller,
  totalAmount,
  milestones,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert escrow
    const escrowResult = await client.query(
      `
      INSERT INTO escrows
      (contract_address, buyer_address, seller_address, total_amount)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [contractAddress, buyer, seller, totalAmount],
    );

    const escrowId = escrowResult.rows[0].id;

    // Insert milestones
    for (let i = 0; i < milestones.length; i++) {
      await client.query(
        `
        INSERT INTO milestones
        (escrow_id, milestone_index, amount)
        VALUES ($1, $2, $3)
        `,
        [escrowId, i, milestones[i]],
      );
    }

    await client.query("COMMIT");

    return escrowId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
