const Transaction = require('../models/Transaction');

/**
 * Create a transaction if one doesn't already exist matching remoteId/receiptNumber/referenceCode.
 * Returns existing or newly created transaction.
 */
async function createOrGetTransaction({ remoteId, receiptNumber, referenceCode }, doc) {
  // Build queries in priority order
  const queries = [];
  if (remoteId) queries.push({ remoteId });
  if (receiptNumber) queries.push({ receiptNumber });
  if (referenceCode) queries.push({ referenceCode });

  for (const q of queries) {
    const existing = await Transaction.findOne(q);
    if (existing) return existing;
  }

  // Try to insert; handle race with duplicate key errors
  try {
    const created = await Transaction.create(doc);
    return created;
  } catch (err) {
    // If duplicate key error, find the existing record
    if (err.code === 11000) {
      for (const q of queries) {
        const existing = await Transaction.findOne(q);
        if (existing) return existing;
      }
    }
    throw err;
  }
}

module.exports = { createOrGetTransaction };
