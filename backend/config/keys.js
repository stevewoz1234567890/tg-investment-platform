module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/',
  secretOrKey: process.env.JWT_SECRET || 'dev-only-change-in-production',
};
