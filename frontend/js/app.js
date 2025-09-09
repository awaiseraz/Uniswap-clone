let provider = null;
let signer = null;
let connectedAddress = null;

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not installed!");
    return;
  }

  // Toggle: if already connected, disconnect
  if (connectedAddress) {
    disconnectWallet();
    return;
  }

  try {
    // create provider and request accounts (prompts MetaMask)
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // explicit request
    signer = await provider.getSigner();
    connectedAddress = await signer.getAddress();

    // Short display like 0x1234...abcd
    const shortAddress =
      connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4);

    // Update UI safely (guard in case element missing)
    const btn = document.getElementById("connectBtn");
    if (btn) btn.innerText = shortAddress;
    // const info = document.getElementById("walletAddress");
    // if (info) info.innerText = `Connected: ${shortAddress}`;

    // Auto-load token data if that function exists
    if (typeof window.loadTokenData === "function") {
      window.loadTokenData();
    }

    // Listen for account/network changes so UI stays in sync
    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    console.log("Wallet connected:", connectedAddress);
  } catch (err) {
    console.error("Connection failed:", err);
    // reset partial state on failure
    provider = null;
    signer = null;
    connectedAddress = null;
  }
}

function disconnectWallet() {
  // remove listeners
  window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
  window.ethereum?.removeListener("chainChanged", handleChainChanged);

  connectedAddress = null;
  signer = null;
  provider = null;

  const btn = document.getElementById("connectBtn");
  if (btn) btn.innerText = "Connect Wallet";
  // const info = document.getElementById("walletAddress");
  // if (info) info.innerText = "";

  console.log("Wallet disconnected");
}

// Account change handler (MetaMask)
function handleAccountsChanged(accounts) {
  if (!accounts || accounts.length === 0) {
    // user locked MetaMask or disconnected account
    disconnectWallet();
    return;
  }

  // switch to new account
  connectedAddress = accounts[0];
  const shortAddress =
    connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4);

  const btn = document.getElementById("connectBtn");
  if (btn) btn.innerText = shortAddress;
  // const info = document.getElementById("walletAddress");
  // if (info) info.innerText = `Connected: ${shortAddress}`;

  // refresh token data if available
  if (typeof window.loadTokenData === "function") {
    window.loadTokenData();
  }
}

// Chain change handler (MetaMask), chainId is a hex string (e.g. "0x1")
function handleChainChanged(chainIdHex) {
  console.log("chainChanged:", chainIdHex);
  // reload token data/UI; chainIdHex must be parsed if needed
  if (typeof window.loadTokenData === "function") {
    window.loadTokenData();
  }
}

// Getter functions for other scripts (token.js)
function getProvider() {
  return provider;
}
function getSigner() {
  return signer;
}
function getConnectedAddress() {
  return connectedAddress;
}

// expose to window so token.js (plain script) can call them
window.connectWallet = connectWallet;
window.disconnectWallet = disconnectWallet;
window.getProvider = getProvider;
window.getSigner = getSigner;
window.getConnectedAddress = getConnectedAddress;

// attach click handler once DOM is ready (safer than running immediately)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("connectBtn");
    if (btn) btn.addEventListener("click", connectWallet);
  });
} else {
  const btn = document.getElementById("connectBtn");
  if (btn) btn.addEventListener("click", connectWallet);
}
