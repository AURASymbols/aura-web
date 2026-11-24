const { ethers } = require("ethers");

function isConfigured() {
  return Boolean(process.env.ETHEREUM_RPC_URL);
}

function getProvider() {
  if (!isConfigured()) return null;
  return new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
}

async function getEthBalance(address) {
  if (!isConfigured()) {
    return {
      configured: false,
      status: "not-configured"
    };
  }

  try {
    if (!ethers.isAddress(address)) {
      throw new Error("Invalid Ethereum address.");
    }

    const provider = getProvider();
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);
    const network = await provider.getNetwork();

    return {
      configured: true,
      status: "connected",
      address,
      chainId: network.chainId.toString(),
      balanceWei: balanceWei.toString(),
      balanceEth
    };
  } catch (error) {
    console.error("Ethereum balance lookup failed:", error.code || error.name || "unknown");
    return {
      configured: true,
      status: "unavailable",
      address,
      error: "Ethereum balance is currently unavailable."
    };
  }
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
    console.error("Ethereum status check failed:", error.code || error.name || "unknown");
    return {
      configured: true,
      status: "unavailable",
      error: "Ethereum connection is currently unavailable."
    };
  }
}

module.exports = {
  getEthereumStatus,
  getProvider,
  getEthBalance,
  isConfigured
};
