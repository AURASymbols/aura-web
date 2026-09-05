const express = require("express");
const { listNFTs, getNFTByTokenId } = require("../data/nfts");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    project: "AURA",
    dataStatus: "catalog",
    note: "This endpoint exposes verified AURA NFT catalog records. It does not claim live ownership, market, or transaction statistics.",
    count: listNFTs().length,
    nfts: listNFTs()
  });
});

router.get("/:tokenId", (req, res) => {
  const nft = getNFTByTokenId(req.params.tokenId);

  if (!nft) {
    return res.status(404).json({
      error: "NFT not found",
      tokenId: req.params.tokenId
    });
  }

  res.json({
    project: "AURA",
    dataStatus: "catalog",
    nft
  });
});

module.exports = router;
