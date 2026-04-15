/**
 * Regression: getTotalCount must not throw when no aggregate row exists yet.
 * Run: MONGO_URI=mongodb://127.0.0.1:27018/test_db node scripts/check-stats-models.js
 */
const mongoose = require('mongoose');
const VisitCount = require('../models/VisitCount');
const RegisterCount = require('../models/RegisterCount');

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/tg_stats_check';

async function main() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const v = await VisitCount.getTotalCount();
  const r = await RegisterCount.getTotalCount();
  if (typeof v !== 'number' || typeof r !== 'number') {
    throw new Error('Expected numeric totals');
  }
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log('check-stats-models: ok (totals', v, r, 'on fresh db)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
