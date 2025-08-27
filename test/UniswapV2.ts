// import { expect } from "chai";
// import { network } from "hardhat";

// const { ethers } = await network.connect();

// describe("Counter", function () {
//   it("Should emit the Increment event when calling the inc() function", async function () {
//     const counter = await ethers.deployContract("Counter");

//     await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
//   });

//   it("The sum of the Increment events should match the current value", async function () {
//     const counter = await ethers.deployContract("Counter");
//     const deploymentBlockNumber = await ethers.provider.getBlockNumber();

//     // run a series of increments
//     for (let i = 1; i <= 10; i++) {
//       await counter.incBy(i);
//     }

//     const events = await counter.queryFilter(
//       counter.filters.Increment(),
//       deploymentBlockNumber,
//       "latest",
//     );

//     // check that the aggregated events match the current value
//     let total = 0n;
//     for (const event of events) {
//       total += event.args.by;
//     }

//     expect(await counter.x()).to.equal(total);
//   });
// });



// import { expect } from "chai";
// import { network } from "hardhat";
// import { expect } from "chai";
// import { network } from "hardhat";

// const { ethers } = await network.connect();
// describe("UniswapV2", function () {
//   it("Should deploy with initial supply to recipient", async function () {
//     const [deployer, recipient] = await ethers.getSigners();

//     const UniswapV2 = await ethers.getContractFactory("UniswapV2");
//     const token = await UniswapV2.deploy(recipient.address, deployer.address);

//     const decimals = await token.decimals();
//     const initialSupply = 1_000_000n * 10n ** BigInt(decimals);

//     expect(await token.totalSupply()).to.equal(initialSupply);
//     expect(await token.balanceOf(recipient.address)).to.equal(initialSupply);
//     expect(await token.owner()).to.equal(deployer.address);
//   });

//   it("Owner should be able to mint tokens", async function () {
//     const [owner, user] = await ethers.getSigners();

//     const UniswapV2 = await ethers.getContractFactory("UniswapV2");
//     const token = await UniswapV2.deploy(user.address, owner.address);

//     await token.mint(user.address, 1000);
//     expect(await token.balanceOf(user.address)).to.equal(
//       (1_000_000n * 10n ** 18n) + 1000n
//     );
//   });

//   it("Non-owner cannot mint tokens", async function () {
//     const [owner, user] = await ethers.getSigners();

//     const UniswapV2 = await ethers.getContractFactory("UniswapV2");
//     const token = await UniswapV2.deploy(user.address, owner.address);

//     await expect(token.connect(user).mint(user.address, 1000)).to.be.revertedWith(
//       "Ownable: caller is not the owner"
//     );
//   });

//   it("Should allow burning tokens", async function () {
//     const [owner, recipient] = await ethers.getSigners();

//     const UniswapV2 = await ethers.getContractFactory("UniswapV2");
//     const token = await UniswapV2.deploy(recipient.address, owner.address);

//     const initialBalance = await token.balanceOf(recipient.address);

//     await token.connect(recipient).burn(500);
//     expect(await token.balanceOf(recipient.address)).to.equal(initialBalance - 500n);
//   });

//   it("Should pause and unpause transfers", async function () {
//     const [owner, recipient, user] = await ethers.getSigners();

//     const UniswapV2 = await ethers.getContractFactory("UniswapV2");
//     const token = await UniswapV2.deploy(recipient.address, owner.address);

//     // Pause by owner
//     await token.pause();

//     await expect(
//       token.connect(recipient).transfer(user.address, 1000)
//     ).to.be.revertedWithCustomError(token, "EnforcedPause"); // OZ v5+ uses custom errors

//     // Unpause
//     await token.unpause();

//     await expect(token.connect(recipient).transfer(user.address, 1000)).to.not.be
//       .reverted;
//   });
// });
import { expect } from "chai";
import { network } from "hardhat";
const {ethers} = await network.connect();
describe("UniswapV2", function () {
  let owner: any;
  let recipient: any;
  let user: any;
  let token: any;

  beforeEach(async function () {
    [owner, recipient, user] = await ethers.getSigners();

    const UniswapV2 = await ethers.getContractFactory("UniswapV2");
    token = await UniswapV2.deploy(recipient.address, owner.address);
  });

  it("Should deploy with initial supply to recipient", async function () {
    const decimals = await token.decimals();
    const initialSupply = 1_000_000n * 10n ** BigInt(decimals);

    expect(await token.totalSupply()).to.equal(initialSupply);
    expect(await token.balanceOf(recipient.address)).to.equal(initialSupply);
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
    const initialBalance = await token.balanceOf(recipient.address);

    await token.connect(recipient).burn(500);
    expect(await token.balanceOf(recipient.address)).to.equal(initialBalance - 500n);
  });

  it("Should pause and unpause transfers", async function () {
  // Pause by owner
  await token.pause();

  await expect(
    token.connect(recipient).transfer(user.address, 1000)
  ).to.be.revertedWithCustomError(token, "EnforcedPause");

  // Unpause
  await token.unpause();
  await expect(token.connect(recipient).transfer(user.address, 1000))
    .to.not.be.revert(ethers);
});
});
