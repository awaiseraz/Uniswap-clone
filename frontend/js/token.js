async function loadTokenData() {
  const provider = window.getProvider();
  const userAddress = window.getConnectedAddress();

  if (!provider || !userAddress) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    // Load ABI JSON
    const abiResponse = await fetch("./ABI-addresses/Contracts-MemeToken.json");
    if (!abiResponse.ok) throw new Error("ABI JSON not found (check path)");
    const MemeTokenArtifact = await abiResponse.json();

    // Load deployed addresses JSON
    const addressesResponse = await fetch("./ABI-addresses/deployed_addresses.json");
    if (!addressesResponse.ok) throw new Error("Deployed addresses JSON not found (check path)");
    const deployedAddresses = await addressesResponse.json();

    const MemeTokenABI = MemeTokenArtifact.abi;
    const MemeTokenAddress = deployedAddresses["Contracts#MemeToken"];
    if (!MemeTokenAddress) throw new Error("MemeToken address missing in deployed_addresses.json");

    // Initialize contract (read-only with provider)
    const tokenContract = new ethers.Contract(MemeTokenAddress, MemeTokenABI, provider);

    // Fetch data
    const decimals = await tokenContract.decimals();
    const totalSupply = await tokenContract.totalSupply();
    const balance = await tokenContract.balanceOf(userAddress);

    // Format values
    const totalSupplyFormatted = ethers.formatUnits(totalSupply, decimals);
    const balanceFormatted = ethers.formatUnits(balance, decimals);

    // Update HTML
    const supplyEl = document.getElementById("totalSupply");
    if (supplyEl) supplyEl.innerText = totalSupplyFormatted;

    const balanceEl = document.getElementById("userBalance");
    if (balanceEl) balanceEl.innerText = balanceFormatted;

    console.log("Token data loaded:", { totalSupplyFormatted, balanceFormatted });
  } catch (err) {
    console.error("Error loading token data:", err);
    alert("Failed to load token data. See console for details.");
  }
}

// Expose globally
window.loadTokenData = loadTokenData;

