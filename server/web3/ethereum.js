const { ethers } = require("ethers");

function isConfigured() {
  return Boolean(process.env.ETHEREUM_RPC_URL);
}

function getProvider() {
  if (!isConfigured()) return null;
  return new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
}

async function getEthereumStatus() {
  if (!isConfigured()) {
    return { configured: false, status: "not configured" };
  }

  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    return {
      configured: true,
      status: "connected",
      chainId: network.chainId.toString(),
      blockNumber
    };
  } catch (error) {
    return {
      configured: true,
      status: "unavailable",
      error: error.message
    };
  }
}

module.exports = { getEthereumStatus };
