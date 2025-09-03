import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Contracts", (m) => {
  const deployer = m.getAccount(0);
  const uniswapV2 = m.contract("UniswapV2", [deployer, deployer]);
  const memeToken = m.contract("MemeToken", [deployer, deployer]);
  return { uniswapV2, memeToken };
});