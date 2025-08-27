import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UniswapV2Module", (m) => {
  const deployer = m.getAccount(0);
  const uniswapV2 = m.contract("UniswapV2", [deployer, deployer]);
  return { uniswapV2 };
});