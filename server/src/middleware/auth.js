module.exports = function authMiddleware(req, res, next) {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token && token === process.env.ADMIN_PASSPHRASE) return next();
  res.status(401).json({ error: "Unauthorized" });
};
