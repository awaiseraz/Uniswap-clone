import { expect } from "chai";
import { network } from "hardhat";

const {ethers} = await network.connect();

describe("MemeToken", function () {
  let owner: any;
  let user: any;
  let token: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const UniswapV2 = await ethers.getContractFactory("MemeToken");
    token = await UniswapV2.deploy(owner.address, owner.address);
  });

  it("Should deploy with initial supply to owner", async function () {
    const decimals = await token.decimals();
    const initialSupply = 1_000_000_000n * 10n ** BigInt(decimals);

    expect(await token.totalSupply()).to.equal(initialSupply);
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
    expect(await token.owner()).to.equal(owner.address);
  });

  it("Owner should be able to mint tokens", async function () {
    await token.mint(user.address, 1000);
    expect(await token.balanceOf(user.address)).to.equal(1000n);
  });

  it("Non-owner cannot mint tokens", async function () {
  await expect(token.connect(user).mint(user.address, 1000))
    .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
    .withArgs(user.address);
});

  it("Should allow burning tokens", async function () {
    const initialBalance = await token.balanceOf(owner.address);

    await token.connect(owner).burn(500);
    expect(await token.balanceOf(owner.address)).to.equal(initialBalance - 500n);
  });

  it("Should pause and unpause transfers", async function () {
  // Pause by owner
  await token.pause();

  await expect(
    token.connect(owner).transfer(user.address, 1000)
  ).to.be.revertedWithCustomError(token, "EnforcedPause");

  // Unpause
  await token.unpause();
  await expect(token.connect(owner).transfer(user.address, 1000))
    .to.not.be.revert(ethers);
});
});
