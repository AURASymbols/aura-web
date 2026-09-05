const NFT_CATALOG = [
  {
    tokenId: "1",
    name: "AURA #001 — ORIGIN",
    collection: "AURA(Symbols of Being)",
    chain: "Ethereum",
    standard: "ERC-1155",
    contractAddress: "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593",
    openSeaUrl: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/1",
    dataStatus: "verified-onchain"
  },
  {
    tokenId: "2",
    name: "AURA #002 — FORCE",
    collection: "AURA(Symbols of Being)",
    chain: "Ethereum",
    standard: "ERC-1155",
    contractAddress: "0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593",
    openSeaUrl: "https://opensea.io/item/ethereum/0xb4a9d1ca2ae56e7491f83cb2b7a4c956fa994593/2",
    dataStatus: "verified-onchain"
  }
];

function listNFTs() {
  return NFT_CATALOG.map((nft) => ({ ...nft }));
}

function getNFTByTokenId(tokenId) {
  return NFT_CATALOG.find((nft) => nft.tokenId === String(tokenId)) || null;
}

module.exports = { listNFTs, getNFTByTokenId };
