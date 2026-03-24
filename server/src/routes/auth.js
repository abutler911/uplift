const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { passphrase } = req.body;
  if (passphrase !== process.env.ADMIN_PASSPHRASE) {
    return res.status(401).json({ error: "Wrong passphrase" });
  }
  res.json({ ok: true, token: passphrase });
});

module.exports = router;
