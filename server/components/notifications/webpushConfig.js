const webpush = require("web-push");

const apiKeys = {
  publicKey:
    "BA38HDLOIcEcSqRso4JvhxRUYKKq7l1Thf8ON3ffpnfRyrFZNG_1zBPGfMcSno83j2_770Eyy_QcyIhHCdvbB-U",
  privateKey: "fpfYRQ3zdGhzkWC0bo0ZrBwTyJeZ8GNwCUHR6oEgcVw",
};

webpush.setVapidDetails(
  "mailto:brunomgferreira17@gmail.com",
  apiKeys.publicKey,
  apiKeys.privateKey
);

module.exports = webpush;
